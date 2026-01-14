
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationEmailProps {
    customerName: string;
    tourName: string;
    date: string;
    peopleCount: number;
    phone?: string;
}

export default function BookingConfirmationEmail({
    customerName = 'Traveler',
    tourName = 'Vietnam Tour',
    date = 'Not selected',
    peopleCount = 1,
}: BookingConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>We received your booking request for {tourName}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Booking Request Received!
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hello <strong>{customerName}</strong>,
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Thank you for booking with <strong>Roving Vietnam Travel</strong>.
                                We have received your request for the comprehensive tour:
                            </Text>
                            <Section className="bg-emerald-50 p-4 rounded-lg my-4 border border-emerald-100">
                                <Text className="text-emerald-800 text-[16px] font-bold m-0 text-center">
                                    {tourName}
                                </Text>
                                <Hr className="border border-emerald-200 my-3" />
                                <Text className="text-gray-700 text-[14px] m-0 text-center">
                                    📅 Date: <strong>{date}</strong>
                                </Text>
                                <Text className="text-gray-700 text-[14px] m-0 text-center">
                                    👥 People: <strong>{peopleCount}</strong>
                                </Text>
                            </Section>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Our team will check availability and contact you shortly to confirm your booking details.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                If you have any urgent questions, please reply to this email or contact us via WhatsApp.
                            </Text>
                            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                                © {new Date().getFullYear()} Roving Vietnam Travel. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
