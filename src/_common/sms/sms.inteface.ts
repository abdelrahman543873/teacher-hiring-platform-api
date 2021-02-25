interface SMS {
    phoneNumber: string;
    message: string;

    sendSMS(phoneNumber: string, message: string): Promise<void>;
}
