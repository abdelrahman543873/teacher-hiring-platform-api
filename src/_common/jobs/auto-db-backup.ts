import * as fs from 'fs';
import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class AutoDbBackupService {
  constructor(
    private readonly configService: ConfigService,
    @InjectPinoLogger(AutoDbBackupService.name) private readonly logger: PinoLogger
  ) {}

  private backupConfig = {
    user: this.configService.get('DB_USER'),
    host: this.configService.get('HOST'),
    database: this.configService.get('DB_NAME'),
    port: 5432,
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: '/root/backups/',
    pgPassFile: '/root/.pgpass'
  };

  // Return date object
  private stringToDate(date: string | Date): Date {
    return new Date(date);
  }

  // Return if variable is empty or not
  private empty(mixedVar: unknown): boolean {
    const emptyValues = [undefined, null, false, 0, '', '0'];
    for (let i = 0; i < emptyValues.length; i++) if (mixedVar === emptyValues[i]) return true;
    if (typeof mixedVar === 'object') {
      for (const key in mixedVar) return false;
      return true;
    }
    return false;
  }

  // Run cron job every day at 5AM
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  handleCron(): void {
    this.logger.info('AUTO POSTGRES DB BACKUP CRON JOB');

    // Create backup folder if not exist
    if (!fs.existsSync(this.backupConfig.autoBackupPath))
      exec(`mkdir ${this.backupConfig.autoBackupPath}`);

    // If no .pgpass file, do anything (do not crash)
    // .pgpass used to access postgres db without asking password
    if (!fs.existsSync(this.backupConfig.pgPassFile)) return this.logger.warn('NO PGPASSFILE FILE');

    // Check for auto backup is enabled or disabled
    if (this.backupConfig.autoBackup == true) {
      let beforeDate: Date,
        oldBackupDir: string,
        oldBackupPath: string,
        currentDate = this.stringToDate(new Date()),
        newBackupDir = `${currentDate.getFullYear()}-${
          currentDate.getMonth() + 1
        }-${currentDate.getDate()}`,
        // New backup path for current backup process
        newBackupPath = `${this.backupConfig.autoBackupPath}pgdump-${newBackupDir}.tar`,
        // Command for postgres dump process
        cmd = `PGPASSFILE=${this.backupConfig.pgPassFile} pg_dump -w -c -U ${this.backupConfig.user} -h ${this.backupConfig.host} -p ${this.backupConfig.port} ${this.backupConfig.database} > ${newBackupPath}`;

      // Check for remove old backup after keeping # of days given in configuration
      if (this.backupConfig.removeOldBackup == true) {
        beforeDate = currentDate;
        // Subtract number of days to keep backup and remove old backup
        beforeDate.setDate(beforeDate.getDate() - this.backupConfig.keepLastDaysBackup);
        oldBackupDir = `${beforeDate.getFullYear()}-${
          beforeDate.getMonth() + 1
        }-${beforeDate.getDate()}`;
        // old backup(after keeping # of days)
        oldBackupPath = `${this.backupConfig.autoBackupPath}pgdump-${oldBackupDir}.tar`;
      }

      // Run dump cmd
      exec(cmd, error => {
        if (error) this.logger.error('RUNNING DUMP CMD', JSON.stringify(error));
        else this.logger.info('POSTGRES');
        if (this.empty(error))
          if (this.backupConfig.removeOldBackup == true && fs.existsSync(oldBackupPath))
            // Check for remove old backup after keeping # of days given in configuration
            exec(`rm -rf ${oldBackupPath}`, err =>
              this.logger.error('REMOVING OLD BACKUPS', JSON.stringify(err))
            );
      });
    }
  }
}
