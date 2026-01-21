export type EmailTemplate = {
    id: string
    label: string
    subject: string
    content: string
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'promo-welcome',
        label: 'Welcome Promotion (New Users)',
        subject: 'Welcome to Roving Vietnam! Here is your 10% OFF code',
        content: `<h2>Welcome to the Roving Vietnam Family, {{name}}! 🌿</h2>
<p>Thank you for subscribing to our newsletter. We are thrilled to have you with us on this journey to discover the hidden gems of Vietnam.</p>
<p>As a special welcome gift, please use the code below for <strong>10% OFF</strong> your first booking:</p>
<div style="background-color: #f0fdf4; border: 2px dashed #16a34a; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
    <span style="font-size: 24px; font-weight: bold; color: #166534; font-family: monospace;">ROVINGNEW10</span>
</div>
<p>Start planning your dream trip today!</p>
<p>Warm regards,<br>The Roving Vietnam Team</p>`
    },
    {
        id: 'spring',
        label: 'Spring Awakening (Hà Giang, Mộc Châu)',
        subject: 'Experience the Magic of Spring in Northern Vietnam 🌸',
        content: `<h2>Hi {{name}}, Spring has arrived in the Mountains! 🌸</h2>
<p>The peach blossoms are blooming in Ha Giang, and the plum flowers cover the hills of Moc Chau in white. There is no better time to witness the vibrant life of the northern highlands.</p>
<h3>Top Spring Destinations:</h3>
<ul>
    <li><strong>Ha Giang Loop:</strong> Drive through breathtaking limestone karsts.</li>
    <li><strong>Moc Chau Plateau:</strong> Immerse yourself in flower valleys.</li>
    <li><strong>Ninh Binh:</strong> Boat ride through serene rivers.</li>
</ul>
<p>Book your spring adventure now to secure the best guides and homestays.</p>
<p><a href="https://rovingvietnam.com/tours" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Explore Spring Tours</a></p>`
    },
    {
        id: 'summer',
        label: 'Summer Vibes (Beach & Adventure)',
        subject: 'Sun, Sea, and Adventure: Vietnam Summer Guide ☀️',
        content: `<h2>Hi {{name}}, Get Ready for a Tropical Summer! ☀️</h2>
<p>From the crystal clear waters of Da Nang to the majestic caves of Phong Nha, summer in Vietnam is full of energy and adventure.</p>
<h3>Summer Highlights:</h3>
<ul>
    <li><strong>Ha Long Bay:</strong> Overnight cruise on emerald waters.</li>
    <li><strong>Da Nang & Hoi An:</strong> Perfect mix of beach relaxation and ancient culture.</li>
    <li><strong>Phong Nha Ke Bang:</strong> Explore the world's largest caves.</li>
</ul>
<p>Don't miss out on our summer packages.</p>
<p><a href="https://rovingvietnam.com/tours" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Summer Deals</a></p>`
    },
    {
        id: 'autumn',
        label: 'Autumn Gold (Harvest Season)',
        subject: 'Golden Terraces & Romantic Autumn 🍂',
        content: `<h2>Hi {{name}}, Fall in Love with Vietnam's Autumn 🍂</h2>
<p>Witness the golden harvest season in Mu Cang Chai and enjoy the cool, romantic breeze of Hanoi's autumn.</p>
<h3>Must-See in Autumn:</h3>
<ul>
    <li><strong>Mu Cang Chai:</strong> Endless golden rice terraces ripe for harvest.</li>
    <li><strong>Hanoi:</strong> Enjoy the scent of milk flowers (Hoa Sua) and pleasant weather.</li>
    <li><strong>Sapa:</strong> Trekking through golden valleys.</li>
</ul>
<p>Capture the most beautiful moments of the year with us.</p>
<p><a href="https://rovingvietnam.com/tours" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Plan Autumn Trip</a></p>`
    },
    {
        id: 'winter',
        label: 'Winter Retreats (Cloud Hunting)',
        subject: 'Magical Winter & Cloud Hunting in Sapa ☁️',
        content: `<h2>Hi {{name}}, Escape to a Winter Wonderland ☁️</h2>
<p>Northern Vietnam in winter offers a unique mystical atmosphere. It's the perfect season for "cloud hunting" in high mountain peaks.</p>
<h3>Winter Activities:</h3>
<ul>
    <li><strong>Sapa & Y Ty:</strong> Sip hot cocoa while watching the sea of clouds.</li>
    <li><strong>Ta Xua:</strong> The ultimate dinosaur spine trekking experience.</li>
    <li><strong>Hot Springs:</strong> Relax in natural mineral hot springs in Tram Tau.</li>
</ul>
<p>Pack your warm clothes and join us for a cozy winter retreat.</p>
<p><a href="https://rovingvietnam.com/tours" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book Winter Tour</a></p>`
    }
]
