import { getCDNUrl } from "@/lib/utils"
import type { Milestone } from "@/types/milestone"


export const milestones: Milestone[] = [
  {
    id: 1,
    title: "First Arrival",
    date: "January 2021",
    position: {
      x: 100,
      y: 100,
    },
    description:
      "Landing at Heathrow with loads of suitcases and a heart full of dreams. The air felt different, crisp and full of possibility.",
    quote: "I remember standing beside Lumi at the airport, watching her clutch her passport so tightly, as if letting go might change everything. I could tell she was happy about this new advanture.",
    tags: ["Beginning", "Heathrow", "Excitement"],
    mediaList: [
      {
        alt: "Heathrow Airport arrival hall",
        src: "https://github.com/jemmy344/cdn-images/raw/7ac17ce1ff9ec1e9158bcfd69af8918f562664ba/lumi-journey/first-arrival/flying-in.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "First view of London skyline",
        src: "https://github.com/jemmy344/cdn-images/raw/7ac17ce1ff9ec1e9158bcfd69af8918f562664ba/lumi-journey/first-arrival/flying-in-2.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "First view of London skyline",
        src: "https://github.com/jemmy344/cdn-images/raw/7ac17ce1ff9ec1e9158bcfd69af8918f562664ba/lumi-journey/first-arrival/flying-in-3.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "First view of London skyline",
        src: "https://github.com/jemmy344/cdn-images/blob/7ac17ce1ff9ec1e9158bcfd69af8918f562664ba/lumi-journey/first-arrival/flying-in-4.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "First view of London skyline",
        src: "https://github.com/jemmy344/cdn-images/raw/7ac17ce1ff9ec1e9158bcfd69af8918f562664ba/lumi-journey/first-arrival/flying-in-5.mp4",
        mediaType: "video",
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
    quote: "The campus was huge! ",
    tags: ["University", "Campus", "Student Life"],
    mediaList: [
      {
        alt: "University campus buildings",
        src: "https://github.com/jemmy344/cdn-images/blob/main/lumi-journey/first-uni-visit/fu-1.jpg?raw=true",
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "University campus buildings",
        src: "https://github.com/jemmy344/cdn-images/blob/main/lumi-journey/first-uni-visit/fu-2.jpg?raw=true",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 3,
    title: "First Shared Flat",
    date: "January 2021",
    position: {
      x: 300,
      y: 150,
    },
    description:
      "Moving into my first shared accommodation with two other international students and best friend.",
    quote:
      "strangers from different countries",
    tags: ["Housing", "Flatmates", "Student Life"],
    mediaList: [
      {
        alt: "Shared student flat kitchen",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-shared-flat/aaflat.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Shared student flat kitchen",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-shared-flat/aflat.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Shared student flat kitchen",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-shared-flat/aflat8.jpg",
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 4,
    title: "First Birthday",
    date: "May 2021",
    position: {
      x: 400,
      y: 180,
    },
    description:
      "Celebrated my birthday in a new country for the first time. My bestie surprised me with a cake.",
    quote: " 'Happy Birthday' ",
    tags: ["Celebration", "Friends"],
    mediaList: [
      {
        alt: "Birthday cake",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-birthday/first-bd.mp4",
        mediaType: "video",
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
      "Couldn't go home for Christmas, so I experienced a small Christmas with my friend's. Plus we had to work at our various part-tim gigs during the holidays.",
    quote: "Felt different from the previous year, but i enjoyed it.",
    weatherEffect: "snow",
    tags: ["Christmas", "Traditions", "Family"],
    mediaList: [
      {
        alt: "Christmas dinner table",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-christmas/fc1.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner table",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-christmas/fc3.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner table",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-christmas/fc4.mp4",
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner table",
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/first-christmas/fs2.mp4",
        mediaType: "video",
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
      "Took a day trip to Peterborough to visit family.",
    quote:
      "The cathedral was magnificent, and i had a lovly time.",
    tags: ["Travel", "Cathedral", "Day Trip"],
    mediaList: [
      {
        alt: "Peterborough Cathedral exterior",
        src: getCDNUrl("lumi-journey/peterborough/peter.mp4"),
        mediaType: "video",
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
        src: "https://github.com/jemmy344/cdn-images/raw/refs/heads/main/lumi-journey/late-night-study/lns1.mp4",
        mediaType: "video",
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
      "Finally found the three bedroom apartment we all stayed at. Made so many memories there, from movie nights to cooking experiments. Lots of laughs.",
    quote: "The moment I got my keys, I danced around my empty apartment like a fool. Freedom!",
    tags: ["Housing", "Independence", "Milestone"],
    mediaList: [
      {
        alt: "Small studio apartment interior",
        src: getCDNUrl("lumi-journey/first-apartment/first-apartment1.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 9,
    title: "Fourth Birthday",
    date: "May 2024",
    position: {
      x: 250,
      y: 400,
    },
    description:
      "Celebrated my birthday in London with friends.",
    quote: "Fun",
    tags: ["London", "Tourism", "Friends"],
    mediaList: [
      {
        alt: "London Eye and Big Ben",
        src: getCDNUrl("lumi-journey/fouth-birthday/3rdbd1.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "London Eye and Big Ben",
        src: getCDNUrl("lumi-journey/fouth-birthday/4thbd.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "London Eye and Big Ben",
        src: getCDNUrl("lumi-journey/fouth-birthday/4thbd3.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 10,
    title: "Greggs",
    date: "2021 2025",
    position: {
      x: 350,
      y: 450,
    },
    description:
      "o2 free greggs 'hot-choco 'sausage roll' from Greggs. Now it's my guilty pleasure every Friday morning.",
    quote: "I don't understand why everyone makes such a big deal about... oh. OH. Now I get it.",
    tags: ["Food", "British Culture", "Discovery"],
    mediaList: [
      {
        alt: "Greggs sausage roll",
        src: getCDNUrl("lumi-journey/greggs/greggs1.mp4"),
        mediaType: "video",
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
    quote: "",
    tags: ["Travel", "Manchester", "Football"],
    mediaList: [
      {
        alt: "Manchester cityscape",
        src: getCDNUrl("lumi-journey/manchester/man1.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Manchester cityscape",
        src: getCDNUrl("lumi-journey/manchester/man2.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Manchester cityscape",
        src: getCDNUrl("lumi-journey/manchester/man3.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Manchester cityscape",
        src: getCDNUrl("lumi-journey/manchester/man4.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Manchester cityscape",
        src: getCDNUrl("lumi-journey/manchester/man6.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 12,
    title: "First Time at the Beach",
    date: "August 2022",
    position: {
      x: 550,
      y: 550,
    },
    description:
      "Day trip to Bournemouth Beach. It wasn't as warm as beaches back home, but there was something charming about the pebbles and the pier.",
    quote: "Had so much fun!",
    tags: ["Beach", "Bournemouth", "Summer"],
    mediaList: [
      {
        alt: "Bournemouth Beach and pier",
        src: getCDNUrl("lumi-journey/beach/beach3.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Bournemouth Beach and pier",
        src: getCDNUrl("lumi-journey/beach/beach2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 13,
    title: "Second Birthday",
    date: "May 2022",
    position: {
      x: 650,
      y: 600,
    },
    description:
      "My second birthday in the UK. This time I organized a proper dinner outing. An amazing Italian pasta with my friends.",
    quote:
      "Birthday",
    tags: ["Birthday", "Outing", "Friends"],
    mediaList: [
      {
        alt: "Dinner party at apartment",
        src: getCDNUrl("lumi-journey/second-birthday/sb1.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
       {
        alt: "Dinner party at apartment",
        src: getCDNUrl("lumi-journey/second-birthday/sb2.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
       {
        alt: "Dinner party at apartment",
        src: getCDNUrl("lumi-journey/second-birthday/sb3.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
       {
        alt: "Dinner party at apartment",
        src: getCDNUrl("lumi-journey/second-birthday/sb4.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 14,
    title: "First Wedding",
    date: "September 2022",
    position: {
      x: 750,
      y: 650,
    },
    description:
      "Got invited to Cousins wedding. Such a beautiful ceremony!",
    quote: "The love and joy in the air were contagious. I danced like nobody was watching, even though everyone was.",
    tags: ["Wedding", "Traditions", "Celebration"],
    mediaList: [
      {
        alt: "Wedding celebration",
        src: getCDNUrl("lumi-journey/first-wedding/wed2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Wedding celebration",
        src: getCDNUrl("lumi-journey/first-wedding/wed3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Wedding celebration",
        src: getCDNUrl("lumi-journey/first-wedding/wed6.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Wedding celebration",
        src: getCDNUrl("lumi-journey/first-wedding/wedding1.mp4"),
        mediaType: "video",
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
      "Saw one of my favorite singer live at the O2 Arena. The crowd's energy was incredible, and I lost my voice from singing along to every song.",
    quote:
      "Standing in that crowd, singing songs I've loved for years, I felt completely at home with my friends.",
    tags: ["Music", "Concert", "London"],
    mediaList: [
      {
        alt: "Concert crowd at O2 Arena",
        src: getCDNUrl("lumi-journey/first-concert/c4.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Concert crowd at O2 Arena",
        src: getCDNUrl("lumi-journey/first-concert/concert1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Concert crowd at O2 Arena",
        src: getCDNUrl("lumi-journey/first-concert/concert2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Concert crowd at O2 Arena",
        src: getCDNUrl("lumi-journey/first-concert/concert3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 16,
    title: "Snow",
    date: "December 2022",
    position: {
      x: 250,
      y: 350,
    },
    description:
      "Woke up to the city transformed into a winter wonderland. Had to take pictures.",
    quote: "I was like a child, No regrets!",
    weatherEffect: "snow",
    tags: ["Snow", "Winter", "Joy"],
    mediaList: [
      {
        alt: "Snowman in the park",
        src: getCDNUrl("lumi-journey/first-snow/snow1.jpg"),
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
      "Christmas with friends.",
    quote: "Nothing says 'I'm settled' like having having friends who are now family to spend the holiday with.",
    weatherEffect: "snow",
    tags: ["Christmas", "Friends"],
    mediaList: [
      {
        alt: "Christmas dinner with friends",
        src: getCDNUrl("lumi-journey/second-christmas/2ndch.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner with friends",
        src: getCDNUrl("lumi-journey/second-christmas/2ndch2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner with friends",
        src: getCDNUrl("lumi-journey/second-christmas/2ndch3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner with friends",
        src: getCDNUrl("lumi-journey/second-christmas/2ndch5.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner with friends",
        src: getCDNUrl("lumi-journey/second-christmas/2ndch7.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 18,
    title: "Rain Rage",
    date: "December 2022",
    position: {
      x: 450,
      y: 200,
    },
    description:
      "It was a cold rainy day in December.",
    quote: "I finally understand why British people talk about weather so much.",
    weatherEffect: "rain",
    tags: ["Weather", "Adaptation", "Learning"],
    mediaList: [
      {
        alt: "Rainy street with umbrellas",
        src: getCDNUrl("lumi-journey/rain-rage/rain1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Rainy street with umbrellas",
        src: getCDNUrl("lumi-journey/rain-rage/rain.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Rainy street with umbrellas",
        src: getCDNUrl("lumi-journey/rain-rage/rain2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 19,
    title: "First Job",
    date: "Febuary 2023",
    position: {
      x: 550,
      y: 150,
    },
    description:
      "Started my first real time job at a chemical company. Learning British slang from colleagues.",
    quote:
      "colleagues were so friendly and welcoming. I felt like I was part of a big family.",
    tags: ["Work", "Language", "Culture"],
    mediaList: [
      {
        alt: "Coffee shop counter",
        src: getCDNUrl("lumi-journey/first-job/fj5.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 20,
    title: "Southampton",
    date: "Febuary 2023",
    position: {
      x: 650,
      y: 200,
    },
    description:
      "Moved up to southampton for my job. Explored the maritime history and enjoyed the harbor views.",
    quote:
      "Standing by the docks, watching ships come and go, I thought about my own journey to this country and how far I'd come.",
    tags: ["Travel", "Southampton", "Job"],
    mediaList: [
      {
        alt: "Southampton harbor",
        src: getCDNUrl("lumi-journey/southampton/sh1.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Southampton harbor",
        src: getCDNUrl("lumi-journey/southampton/south.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 21,
    title: "Graduation",
    date: "September 2023",
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
        src: getCDNUrl("lumi-journey/grad/grad-1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Graduation ceremony",
        src: getCDNUrl("lumi-journey/grad/grad-2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Graduation ceremony",
        src: getCDNUrl("lumi-journey/grad/grad-3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Graduation ceremony",
        src: getCDNUrl("lumi-journey/grad/grad-4.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 22,
    title: "3rd Birthday",
    date: "May 2023",
    position: {
      x: 850,
      y: 300,
    },
    description:
      "Third birthday in the UK. Celebrated with a weekend trip to bath.",
    quote: "What a journey it's been.",
    tags: ["Birthday", "Bath", "Reflection"],
    mediaList: [
      {
        alt: "Cotswolds countryside",
        src: getCDNUrl("lumi-journey/third-birthday/VID-20250518-WA0042.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Cotswolds countryside",
        src: getCDNUrl("lumi-journey/third-birthday/sb4.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Cotswolds countryside",
        src: getCDNUrl("lumi-journey/third-birthday/sb5.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 23,
    title: "Mini StayCation",
    date: "July 2024",
    position: {
      x: 150,
      y: 500,
    },
    description:
      "Took a week off to spend the week my my friends. Had fun playing games, cooking and taking pictures.",
    quote: "Fun week off.",
    tags: ["Exploration", "City", "Discovery"],
    mediaList: [
      {
        alt: "Hidden city gem",
        src: getCDNUrl("lumi-journey/mini-staycation/mini.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Hidden city gem",
        src: getCDNUrl("lumi-journey/mini-staycation/minii.mp4"),
        mediaType: "video",
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
      "Hang outs with friend throughout the year. From curry houses to fish and chip shops, we're eating our way through every cuisine this city has to offer.",
    quote:
      "From curry houses to fish and chip shops, we're eating our way through every cuisine this city has to offer.",
    tags: ["Food", "Friends", "Tradition"],
    mediaList: [
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outing-2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outing-a.mp4"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-4.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-5.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-6.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-7.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-8.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },

      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings-9.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outings99.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outingsr.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Friends at a restaurant",
        src: getCDNUrl("lumi-journey/outings/outingsw.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 25,
    title: "Proposal",
    date: "October 2024",
    position: {
      x: 350,
      y: 600,
    },
    description:
      "My partner proposed at an Escape room. Complete surprise - I was speechless (before saying yes, of course).",
    quote: "In that moment, I knew for certain that this country had become my home in every sense of the word.",
    tags: ["Love", "Engagement", "Milestone"],
    mediaList: [
      {
        alt: "Engagement ring and hands",
        src: getCDNUrl("lumi-journey/proposal/prop1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 26,
    title: "Civil Wedding",
    date: "Febuary 2025",
    position: {
      x: 400,
      y: 650,
    },
    description:
      "Our civil ceremony at the local registry office. Small, intimate, and perfect. Followed by a celebration in a beautiful resturant with friends.",
    quote:
      "Signing those papers made it official - this country isn't just where I live, it's where I've built my life and future.",
    tags: ["Wedding", "Love", "Milestone", "Family"],
    mediaList: [
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/cw1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/cw2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/cw3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/cw4.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/cw7.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Civil wedding ceremony",
        src: getCDNUrl("lumi-journey/civil-wedding/civilw.mp4"),
        mediaType: "video",
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
      "Fourth Christmas in the UK. Everything was perfect.",
    quote:
      "Photos says it all, I couldn't help but feel overwhelmingly grateful.",
    weatherEffect: "snow",
    tags: ["Christmas", "Family", "Love"],
    mediaList: [
      {
        alt: "Christmas dinner with family",
        src: getCDNUrl("lumi-journey/fourth-christmas/chrismas41.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Christmas dinner with family",
        src: getCDNUrl("lumi-journey/fourth-christmas/chrismas42.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
    ],
  },
  {
    id: 28,
    title: "Random",
    date: "2021-2025",
    position: {
      x: 550,
      y: 750,
    },
    description:
      "Loads of memories.",
    quote:
      "Sometimes the best adventures are the ones you don't plan. This country still surprises me in the best ways.",
    tags: ["Adventure", "Spontaneity", "Discovery"],
    mediaList: [
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-1.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-2.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-3.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-5.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-a.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-b.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random-c.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random00.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random34.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random555.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random6.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random78.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random8.jpg"),
        mediaType: "image",
        width: "600",
        height: "400",
      },
      {
        alt: "Village pub exterior",
        src: getCDNUrl("lumi-journey/random/random9.mp4"),
        mediaType: "video",
        width: "600",
        height: "400",
      },
    ],
  },
]
