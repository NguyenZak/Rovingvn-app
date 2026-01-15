import { getAllTestimonials } from "@/lib/actions/testimonial-actions";
import { TestimonialsClient } from "./TestimonialsClient";

export const revalidate = 0;

export default async function TestimonialsPage() {
    const { data: testimonials = [] } = await getAllTestimonials();

    return <TestimonialsClient initialTestimonials={testimonials} />;
}
