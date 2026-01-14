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
    Link,
    Row,
    Column,
} from '@react-email/components';

interface Destination {
    id: string;
    name: string;
}

interface TravelStyle {
    id: string;
    name: string;
}

interface CustomTripConfirmationEmailProps {
    customerName: string;
    destinations: Destination[];
    durationDays: number;
    travelDate?: string;
    travelStyles: TravelStyle[];
    numberOfTravelers: number;
    additionalNotes?: string;
}

export const CustomTripConfirmationEmail = ({
    customerName = 'Traveler',
    destinations = [],
    durationDays = 0,
    travelDate = 'Not specified',
    travelStyles = [],
    numberOfTravelers = 1,
    additionalNotes = '',
}: CustomTripConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>We received your trip request - Roving Vietnam Travel</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Text style={logoText}>Roving Vietnam Travel</Text>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>Trip Request Received!</Heading>
                    <Text style={text}>Dear {customerName},</Text>
                    <Text style={text}>
                        Thank you for choosing Roving Vietnam to design your dream holiday. We have received your request and our travel experts are already reviewing your preferences.
                    </Text>

                    <Section style={summaryParam}>
                        <Heading style={h2}>Your Trip Details</Heading>
                        <Row style={row}>
                            <Column style={columnLabel}>Destinations:</Column>
                            <Column style={columnValue}>{destinations.map(d => d.name).join(', ')}</Column>
                        </Row>
                        <Row style={row}>
                            <Column style={columnLabel}>Duration:</Column>
                            <Column style={columnValue}>{durationDays} Days</Column>
                        </Row>
                        <Row style={row}>
                            <Column style={columnLabel}>Travel Date:</Column>
                            <Column style={columnValue}>{travelDate || 'Flexible'}</Column>
                        </Row>
                        <Row style={row}>
                            <Column style={columnLabel}>Travelers:</Column>
                            <Column style={columnValue}>{numberOfTravelers} People</Column>
                        </Row>
                        <Row style={row}>
                            <Column style={columnLabel}>Styles:</Column>
                            <Column style={columnValue}>{travelStyles.map(s => s.name).join(', ') || 'Not specified'}</Column>
                        </Row>
                        {additionalNotes && (
                            <Row style={row}>
                                <Column style={columnLabel} colSpan={2}>
                                    <strong>Additional Notes:</strong>
                                    <br />
                                    <Text style={noteText}>{additionalNotes}</Text>
                                </Column>
                            </Row>
                        )}
                    </Section>

                    <Text style={text}>
                        We will craft a personalized itinerary and get back to you shortly (usually within 24-48 hours).
                    </Text>

                    <Section style={btnContainer}>
                        <Link href="https://www.rovingvietnamtravel.com/destinations" style={button}>
                            Discover More Destinations
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

export default CustomTripConfirmationEmail;

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
    color: '#059669',
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

const h2 = {
    color: '#059669',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 15px',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'left' as const,
};

const summaryParam = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    margin: '20px 0',
};

const row = {
    marginBottom: '10px',
};

const columnLabel = {
    fontWeight: 'bold' as const,
    width: '30%',
    verticalAlign: 'top',
    fontSize: '15px',
    color: '#555',
};

const columnValue = {
    width: '70%',
    verticalAlign: 'top',
    fontSize: '15px',
    color: '#333',
};

const noteText = {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '5px',
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
