import { UserRepository } from 'src/user/repositories/user.repository';
import { FilesFactory } from 'src/_common/uploader/file.factory';
import { FileRepository } from 'src/_common/uploader/file.repository';

export const seed = async ({ count, truncate }) => {
  const userRepository = new UserRepository();
  const fileRepository = new FileRepository();
  const users = await userRepository.findUsersByFilter();

  if (!users.length) {
    console.log('ERROR: Please seed roles first');
    process.exit(1);
  }

  if (truncate) {
    fileRepository.truncateFileModel();
  }

  return await FilesFactory(count, {
    usersIds: users.map(({ id }) => id),
  });
};
