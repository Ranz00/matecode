// Llama a la Vercel Function /api/sendEmail, no a AWS directamente
// Las credenciales de AWS quedan en el servidor, nunca en el frontend

interface SendEmailParams {
    to: string;
    subject: string;
    body: string;
}

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
    const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
    });

    if (!response.ok) {
        throw new Error("Failed to send email");
    }

    return response.json();
};