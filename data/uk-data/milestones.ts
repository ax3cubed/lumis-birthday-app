import type { Milestone } from "@/types/milestone"


export const milestones: Milestone[] = [
  {
    id: 1,
    title: "First Arrival",
    date: "September 2021",
    position: {
      x: 100,
      y: 100,
    },
    description:
      "Landing at Heathrow with two suitcases and a heart full of dreams. The air felt different, crisp and full of possibility.",
    quote: "I remember clutching my passport so tightly, wondering if I'd made the right decision.",
    tags: ["Beginning", "Heathrow", "Excitement"],
    mediaList: [
      {
        alt: "Heathrow Airport arrival hall",
        src: "/media/first-arrival.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "First view of London skyline",
        src: "/media/london-skyline.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      }
    ],
  },
  {
    id: 2,
    title: "First Visit to the University",
    date: "September 2021",
    position: {
      x: 200,
      y: 200,
    },
    description:
      "Walking through the campus for the first time, getting lost between buildings, and finally finding my department. The architecture was so different from back home.",
    quote: "The campus was huge! I must have walked in circles for an hour before finding the right building.",
    tags: ["University", "Campus", "Student Life"],
    mediaList: [
      {
        alt: "University campus buildings",
        src: "/media/university-campus.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 3,
    title: "First Shared Flat",
    date: "October 2021",
    position: {
      x: 300,
      y: 150,
    },
    description:
      "Moving into my first shared accommodation with three other international students. We were all equally confused about how the washing machine worked.",
    quote:
      "Four strangers from four different countries trying to figure out British appliances - it was chaos but so much fun.",
    tags: ["Housing", "Flatmates", "Student Life"],
    mediaList: [
      {
        alt: "Shared student flat kitchen",
        src: "/media/shared-flat.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 4,
    title: "First Birthday",
    date: "November 2021",
    position: {
      x: 400,
      y: 180,
    },
    description:
      "Celebrated my birthday in a new country for the first time. My flatmates surprised me with a cake and took me to a proper British pub.",
    quote: "They sang 'Happy Birthday' so loudly that the entire pub joined in. I was mortified but secretly loved it.",
    tags: ["Celebration", "Friends", "Pub"],
    mediaList: [
      {
        alt: "Birthday cake in a pub",
        src: "/media/first-birthday.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 5,
    title: "First Christmas",
    date: "December 2021",
    position: {
      x: 500,
      y: 220,
    },
    description:
      "Couldn't go home for Christmas, so I experienced a British Christmas with my friend's family. Boxing Day was a completely new concept to me!",
    quote: "Their family traditions were so different from mine, but they made me feel like I belonged.",
    weatherEffect: "snow",
    tags: ["Christmas", "Traditions", "Family"],
    mediaList: [
      {
        alt: "Christmas dinner table",
        src: "/media/first-christmas.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 6,
    title: "First Visit to Peterborough",
    date: "January 2022",
    position: {
      x: 600,
      y: 250,
    },
    description:
      "Took a day trip to Peterborough to visit the cathedral. Got caught in typical British drizzle without an umbrella.",
    quote:
      "The cathedral was magnificent, but I learned my lesson about always carrying an umbrella in England, regardless of the forecast.",
    tags: ["Travel", "Cathedral", "Day Trip"],
    mediaList: [
      {
        alt: "Peterborough Cathedral exterior",
        src: "/media/peterborough-cathedral.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 7,
    title: "Late-night Studies",
    date: "February 2022",
    position: {
      x: 700,
      y: 300,
    },
    description:
      "The weeks before midterms were intense. Practically lived in the university library, surviving on vending machine coffee and biscuits.",
    quote: "I think I saw more sunrises that month than I had in my entire life before.",
    tags: ["University", "Studies", "Stress"],
    mediaList: [
      {
        alt: "Student studying late at library",
        src: "/media/late-night-studies.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 8,
    title: "First Apartment",
    date: "March 2022",
    position: {
      x: 800,
      y: 350,
    },
    description:
      "Finally found my own little studio apartment. It was tiny but it was mine. The landlord was surprisingly nice and helped me set up everything.",
    quote: "The moment I got my keys, I danced around my empty apartment like a fool. Freedom!",
    tags: ["Housing", "Independence", "Milestone"],
    mediaList: [
      {
        alt: "Small studio apartment interior",
        src: "/media/first-apartment.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 9,
    title: "London Hangout",
    date: "April 2022",
    position: {
      x: 250,
      y: 400,
    },
    description:
      "Weekend trip to London with university friends. We did all the touristy things - Big Ben, London Eye, Buckingham Palace, and got lost on the Tube multiple times.",
    quote: "We walked so much that my feet were absolutely killing me, but I wouldn't have missed it for the world.",
    tags: ["London", "Tourism", "Friends"],
    mediaList: [
      {
        alt: "London Eye and Big Ben",
        src: "/media/london-hangout.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 10,
    title: "Greggs",
    date: "May 2022",
    position: {
      x: 350,
      y: 450,
    },
    description:
      "My British classmate insisted I try something called a 'sausage roll' from Greggs. Now it's my guilty pleasure every Friday morning.",
    quote: "I don't understand why everyone makes such a big deal about... oh. OH. Now I get it.",
    tags: ["Food", "British Culture", "Discovery"],
    mediaList: [
      {
        alt: "Greggs sausage roll",
        src: "/media/greggs-sausage-roll.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 11,
    title: "Trip to Manchester",
    date: "June 2022",
    position: {
      x: 450,
      y: 500,
    },
    description:
      "Visited Manchester for a weekend. The industrial architecture was fascinating, and I finally understood why people are so passionate about football here.",
    quote: "I accidentally wore the wrong team's colors in a pub. The looks I got! Never making that mistake again.",
    tags: ["Travel", "Manchester", "Football"],
    mediaList: [
      {
        alt: "Manchester cityscape",
        src: "/media/manchester-trip.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 12,
    title: "First Time at the Beach",
    date: "July 2022",
    position: {
      x: 550,
      y: 550,
    },
    description:
      "Day trip to Brighton Beach. It wasn't as warm as beaches back home, but there was something charming about the pebbles and the pier.",
    quote: "I was the only one brave enough to dip my toes in the water. It was freezing!",
    tags: ["Beach", "Brighton", "Summer"],
    mediaList: [
      {
        alt: "Brighton Beach and pier",
        src: "/media/brighton-beach.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 13,
    title: "Second Birthday",
    date: "November 2022",
    position: {
      x: 650,
      y: 600,
    },
    description:
      "My second birthday in the UK. This time I organized a proper dinner party at my apartment. Attempted to cook British food for my friends - with mixed results.",
    quote:
      "My Yorkshire puddings didn't rise, but my friends pretended they were perfect. That's when I knew they were keepers.",
    tags: ["Birthday", "Cooking", "Friends"],
    mediaList: [
      {
        alt: "Dinner party at apartment",
        src: "/media/second-birthday.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 14,
    title: "First Wedding",
    date: "August 2022",
    position: {
      x: 750,
      y: 650,
    },
    description:
      "Got invited to a British wedding. The hats! The traditions! The dancing! It was so different from weddings in my country.",
    quote: "I caught the bouquet and didn't know whether to be embarrassed or proud. Everyone cheered so loudly!",
    tags: ["Wedding", "Traditions", "Celebration"],
    mediaList: [
      {
        alt: "British wedding celebration",
        src: "/media/first-wedding.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 15,
    title: "First Concert",
    date: "September 2022",
    position: {
      x: 150,
      y: 300,
    },
    description:
      "Saw my favorite band live at the O2 Arena. The crowd's energy was incredible, and I lost my voice from singing along to every song.",
    quote:
      "Standing in that crowd, singing songs I've loved for years, I felt completely at home for the first time since arriving.",
    tags: ["Music", "Concert", "London"],
    mediaList: [
      {
        alt: "Concert crowd at O2 Arena",
        src: "/media/first-concert.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 16,
    title: "First Snow",
    date: "December 2022",
    position: {
      x: 250,
      y: 350,
    },
    description:
      "Woke up to the city transformed into a winter wonderland. Built my first snowman and had my first snowball fight in the park.",
    quote: "I was like a child, catching snowflakes on my tongue and making snow angels. No regrets!",
    weatherEffect: "snow",
    tags: ["Snow", "Winter", "Joy"],
    mediaList: [
      {
        alt: "Snowman in the park",
        src: "/media/first-snow.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 17,
    title: "Second Christmas",
    date: "December 2022",
    position: {
      x: 350,
      y: 250,
    },
    description:
      "Hosted Christmas dinner for friends who couldn't go home. Burned the Yorkshire puddings but nobody seemed to mind.",
    quote: "Nothing says 'I'm settled' like having enough chairs to invite people over for dinner.",
    weatherEffect: "snow",
    tags: ["Christmas", "Friends", "Hosting"],
    mediaList: [
      {
        alt: "Christmas dinner with friends",
        src: "/media/second-christmas.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 18,
    title: "Rain Rage",
    date: "February 2023",
    position: {
      x: 450,
      y: 200,
    },
    description:
      "Had my first meltdown about the constant drizzle. Bought a proper raincoat the next day and learned to embrace it.",
    quote: "I finally understand why British people talk about weather so much. It's a genuine emotional journey.",
    weatherEffect: "rain",
    tags: ["Weather", "Adaptation", "Learning"],
    mediaList: [
      {
        alt: "Rainy street with umbrellas",
        src: "/media/rain-rage.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 19,
    title: "First Job",
    date: "March 2023",
    position: {
      x: 550,
      y: 150,
    },
    description:
      "Started my first part-time job at a local café. Learning British slang from customers became my favorite pastime.",
    quote:
      "A customer asked if I could 'pop the kettle on' and I looked for someone named Kettle. My manager still teases me about it.",
    tags: ["Work", "Language", "Culture"],
    mediaList: [
      {
        alt: "Coffee shop counter",
        src: "/media/first-job.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 20,
    title: "Southampton",
    date: "April 2023",
    position: {
      x: 650,
      y: 200,
    },
    description:
      "Weekend trip to Southampton to visit a university friend. Explored the maritime history and enjoyed the harbor views.",
    quote:
      "Standing by the docks, watching ships come and go, I thought about my own journey to this country and how far I'd come.",
    tags: ["Travel", "Southampton", "Reflection"],
    mediaList: [
      {
        alt: "Southampton harbor",
        src: "/media/southampton.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 21,
    title: "Graduation",
    date: "June 2023",
    position: {
      x: 750,
      y: 250,
    },
    description:
      "Finally graduated! Wearing the cap and gown, taking photos with friends, and celebrating all our hard work. My parents flew in for the ceremony.",
    quote: "Hearing my name called and walking across that stage was terrifying and exhilarating all at once.",
    tags: ["Graduation", "Achievement", "Family"],
    mediaList: [
      {
        alt: "Graduation ceremony",
        src: "/media/graduation.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 22,
    title: "3rd Birthday",
    date: "November 2023",
    position: {
      x: 850,
      y: 300,
    },
    description:
      "Third birthday in the UK. Celebrated with a weekend trip to the Cotswolds. Stayed in a charming cottage and explored the countryside.",
    quote: "Three years ago, I couldn't have imagined feeling so at home in this country. What a journey it's been.",
    tags: ["Birthday", "Cotswolds", "Reflection"],
    mediaList: [
      {
        alt: "Cotswolds countryside",
        src: "/media/third-birthday-cotswolds.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 23,
    title: "Mini StayCation",
    date: "January 2024",
    position: {
      x: 150,
      y: 500,
    },
    description:
      "Took a week off to explore my own city as a tourist. Discovered hidden gems I'd walked past a hundred times without noticing.",
    quote: "Sometimes you need to look at familiar places with fresh eyes to truly appreciate them.",
    tags: ["Exploration", "City", "Discovery"],
    mediaList: [
      {
        alt: "Hidden city gem",
        src: "/media/mini-staycation.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 24,
    title: "Outings",
    date: "February 2024",
    position: {
      x: 250,
      y: 550,
    },
    description:
      "Started a monthly tradition of trying a new restaurant with friends. Our 'Taste Tour' has become the highlight of each month.",
    quote:
      "From curry houses to fish and chip shops, we're eating our way through every cuisine this city has to offer.",
    tags: ["Food", "Friends", "Tradition"],
    mediaList: [
      {
        alt: "Friends at a restaurant",
        src: "/media/outings.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 25,
    title: "Proposal",
    date: "March 2024",
    position: {
      x: 350,
      y: 600,
    },
    description:
      "My partner proposed at the spot where we had our first date. Complete surprise - I was speechless (before saying yes, of course).",
    quote: "In that moment, I knew for certain that this country had become my home in every sense of the word.",
    tags: ["Love", "Engagement", "Milestone"],
    mediaList: [
      {
        alt: "Engagement ring and hands",
        src: "/media/proposal.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 26,
    title: "Civil Wedding",
    date: "June 2024",
    position: {
      x: 400,
      y: 650,
    },
    description:
      "Our civil ceremony at the local registry office. Small, intimate, and perfect. Followed by a celebration in a beautiful garden with close friends.",
    quote:
      "Signing those papers made it official - this country isn't just where I live, it's where I've built my life and future.",
    tags: ["Wedding", "Love", "Milestone", "Family"],
    mediaList: [
      {
        alt: "Civil wedding ceremony",
        src: "/media/civil-wedding.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 27,
    title: "Fourth Christmas",
    date: "December 2024",
    position: {
      x: 450,
      y: 700,
    },
    description:
      "Fourth Christmas in the UK, first as a married couple. Hosted a massive dinner for friends and in-laws. Everything was perfect.",
    quote:
      "Looking around the table at all these people who've become my family, I couldn't help but feel overwhelmingly grateful.",
    weatherEffect: "snow",
    tags: ["Christmas", "Family", "Love"],
    mediaList: [
      {
        alt: "Christmas dinner with family",
        src: "/media/fourth-christmas.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 28,
    title: "Random",
    date: "May 2025",
    position: {
      x: 550,
      y: 750,
    },
    description:
      "Spontaneous weekend away with no plans. Ended up in a tiny village with the most amazing pub and the friendliest locals.",
    quote:
      "Sometimes the best adventures are the ones you don't plan. This country still surprises me in the best ways.",
    tags: ["Adventure", "Spontaneity", "Discovery"],
    mediaList: [
      {
        alt: "Village pub exterior",
        src: "/media/random-village-pub.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
]
