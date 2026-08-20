import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
    region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    },
});

interface SendEmailParams {
    to: string;
    subject: string;
    body: string;
}

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
    const command = new SendEmailCommand({
        Source: "00rhnaz@gmail.com",
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: body },
            },
        },
    });

    return sesClient.send(command);
};