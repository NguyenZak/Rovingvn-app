import * as React from 'react';
import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Preview,
    Section,
    Text,
    Hr,
    Img,
    Link,
} from '@react-email/components';

interface ContactConfirmationEmailProps {
    customerName: string;
}

export const ContactConfirmationEmail = ({
    customerName = 'Traveler',
}: ContactConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>We received your message - Roving Vietnam Travel</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    {/* Placeholder for Logo - replace with actual URL if available */}
                    <Text style={logoText}>Roving Vietnam Travel</Text>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>Thank You for Contacting Us!</Heading>
                    <Text style={text}>
                        Dear {customerName},
                    </Text>
                    <Text style={text}>
                        We have successfully received your message. Thank you for reaching out to **Roving Vietnam Travel**.
                    </Text>
                    <Text style={text}>
                        Our team is reviewing your inquiry and will get back to you as soon as possible (usually within 24 hours).
                    </Text>
                    <Text style={text}>
                        In the meantime, feel free to browse our latest tours and destinations on our website.
                    </Text>
                    <Section style={btnContainer}>
                        <Link href="https://rovingvietnam.com/tours" style={button}>
                            Explore Tours
                        </Link>
                    </Section>
                    <Hr style={dottedLine} />
                    <Text style={footer}>
                        This is an automated message. Please do not reply directly to this email if it was sent from a noreply address.
                        <br />
                        For urgent matters, please contact us via WhatsApp: +84 988 869 583
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default ContactConfirmationEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const header = {
    padding: '32px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e6ebf1',
};

const logoText = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#059669', // Emerald 600
    margin: '0',
};

const content = {
    padding: '32px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'left' as const,
};

const btnContainer = {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
};

const button = {
    backgroundColor: '#059669',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const dottedLine = {
    margin: '20px 0',
    color: '#cccccc',
    borderTopStyle: 'dotted' as const,
    borderTopWidth: '1px',
    borderTopColor: '#cccccc',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center' as const,
    marginTop: '32px',
};
