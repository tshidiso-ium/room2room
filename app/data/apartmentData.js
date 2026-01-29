const apartmentData = {
    '1-Room-Mayibuye': {
      title: 'Modern 1 Room Bachelor',
      price: 'R2,500/month',
      location: 'Mayibuye',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d',
             'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmuybuye-1-room%2Fpicture1.jpeg?alt=media&token=50fd9673-5126-4959-9bda-3390d188aeeb', 
             'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmuybuye-1-room%2Fpicture2.jpeg?alt=media&token=8fd4ed57-c858-494e-b0fb-328fd72411c6',
            'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmuybuye-1-room%2Fpicture3.jpeg?alt=media&token=eec6d3b5-a6fa-4ceb-aae9-654726e1b42f',
          'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmuybuye-1-room%2Fpicture4.jpeg?alt=media&token=f99e7462-db4a-4b0f-a144-2a115d90f666'],
      description: `<p>One neat and clean room is available right now.</p>

<p><strong>Rent:</strong> R2500 per month<br>
<strong>Deposit:</strong> R2500</p>

<p>This room is good for someone looking for a safe and quiet place to stay. Rooms like this don't stay open for long, so <strong>contact me soon</strong> if you want it.</p>`,
      features: {
        wifi: true,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    '1-Room-Winnie': {
      title: 'Winnie 1 Room',
      price: 'R1,350/month',
      location: 'Winnie',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fwinnie-zone-1%2Fwinnie-zone-1-picture-1.webp?alt=media&token=09b519ff-8879-4271-bf50-e22e63bfcf85',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fwinnie-zone-1%2Fwinnie-zone-1-picture-2.webp?alt=media&token=b1ad7333-ebf2-4637-9a72-09bab264fcd0', 
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fwinnie-zone-1%2Fwinnie-zone-1-picture-3.webp?alt=media&token=165fec99-9ba2-4d9e-b008-d11f736cf51d',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fwinnie-zone-1%2Fwinnie-zone-1-picture-4.webp?alt=media&token=5cf2268a-4dc7-41b9-af69-4f8c2b6e36d0'],
      description: `<p>This clean and comfortable room in Winnie is perfect for someone looking for a safe and affordable place to stay.</p>

<p><strong>Rent:</strong> R1,350 per month</p>

<p>The room is neat, easy to maintain, and in a quiet area close to taxis and local shops. It is suitable for one person who wants privacy and peace.</p>

<p>Water and electricity are easy to access, and the yard is well looked after. This room is great value for money and will go quickly — <strong>contact us soon to secure it!</strong></p>`,
      features: {
        wifi: false,
        geyser: false,
        petsAllowed: false,
        parking: true
      }
    },
    '1-Room-eNtshonalanga': {
      title: 'eNtshonalanga Bachelor',
      price: 'R2,800/month',
      location: 'eNtshonalanga',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-1.webp?alt=media&token=5ebb8f40-35a3-4ca8-b45a-3d942a317584',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-2.webp?alt=media&token=6368035a-1b0e-4b8b-89be-e7b40474d639', 
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-3.webp?alt=media&token=765b3918-dc35-4d32-9f59-e444cd27f24a',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-4.webp?alt=media&token=fd26ee91-a7c7-4c5e-ad63-a7580a546dc3',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-5.webp?alt=media&token=7d2ddd0f-d7b6-4549-ad5b-5c7ff3a9151a',
  'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-6.webp?alt=media&token=b055bd95-3ba3-4afa-a48e-8d25a3a9297e',
'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-7.webp?alt=media&token=d165b5c8-6c69-4ff7-ab05-c3694d3b2447'],
      description: `<p>This bachelor room in eNtshonalanga is perfect for someone who wants a modern, private space in a quiet and safe area.</p>

<p><strong>Rent:</strong> R2,800 per month</p>

<p>The room is neat and spacious, with enough space for your bed, couch and small kitchen area. It is close to local shops and public transport, making it easy to travel to work or school.</p>

<p>There is <strong>Wi-Fi</strong> available. This is a great place for a single person or student who wants comfort and convenience.</p>

<p>Places like this don’t stay empty for long — <strong>contact us soon to book a viewing!</strong>`,
      features: {
        wifi: true,
        geyser: true,
        petsAllowed: false,
        parking: false
      }
    },
    '1-Room-eNtshonalanga-2': {
      title: 'eNtshonalanga 1 Room',
      price: 'R1,300/month',
      location: 'eNtshonalanga',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-1-room-id1-pic-1.jpeg?alt=media&token=d04f4071-321d-496e-b4a8-c09626d84300','https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-1-room-id1-pic-1.jpeg?alt=media&token=d04f4071-321d-496e-b4a8-c09626d84300',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-1-room-id1-pic-2.png?alt=media&token=7b030db7-fd11-4a4f-b93a-79c85d9e6cc9'],
      description: `<p>This 1 room in eNtshonalanga is perfect for someone who wants private space in a quiet and safe area.</p>

<p><strong>Rent:</strong> R1,300 per month</p>

<p>The room is neat and spacious, with enough space for your bed. It is close to local shops and public transport, making it easy to travel to work or school.</p>

<p>There is <strong>Wi-Fi</strong> available. This is a great place for a single person or student who wants comfort and convenience.</p>

<p>Places like this don’t stay empty for long — <strong>contact us soon to book a viewing!</strong>`,
      features: {
        wifi: false,
        geyser: false,
        petsAllowed: false,
        parking: false
      }
    },
    'endulwini-cottage': {
      title: 'eNdulwini Cottage',
      price: 'R3,000/month',
      location: 'eNdulwini',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-1.webp?alt=media&token=69f4a41e-974a-4f0c-b16a-7dce9671ce8f',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-2.webp?alt=media&token=ae5d05fa-8975-4b3c-974f-7b4a1371d060', 
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-3.webp?alt=media&token=8b97cc19-3534-4b03-8fd8-0fac78cca4d1',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-4.webp?alt=media&token=4cd3668a-7aeb-4d40-aa84-6a2dfcb91a82',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-5.webp?alt=media&token=74c7d87a-4fed-4ade-ac46-8d103b41bab4'],
      description: `<p>This neat and private one-bedroom cottage in eNdulwini is perfect for someone who wants a peaceful and comfortable home.</p>

<p><strong>Rent:</strong> R3,000 per month<br>
<strong>Deposit:</strong> R4,000<br>
<strong>Admin Fee:</strong> R700</p>

<p>The cottage has a separate bedroom for extra privacy, with plenty of natural light and a warm, homely feel. It is well looked after and ideal for a working person or a couple who wants quiet living.</p>

<p>You also get a <strong>geyser for hot water</strong> and <strong>safe parking</strong> inside the yard. The area is quiet, safe, and close to shops and public transport, making daily living convenient.</p>

<p>This is a great place at a very good price. Cottages like this get taken quickly — <strong>contact us soon to secure your spot!</strong></p>`,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'hospital-view-1-room': {
      title: 'Hospital View 1 Room',
      price: 'R1,800/month',
      location: 'Hospital View',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fhospital-view-picture-1.png?alt=media&token=77ad973c-c51a-4a30-a8c1-96ed2d438071',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fhospital-view-picture-2.png?alt=media&token=02d16309-7747-4938-9176-e91c8a1ad0bb',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fhospital-view-picture-3.png?alt=media&token=d148ed2e-71f1-4b7c-8f3c-e6751e79958e'
      ],
      description: `<p>This clean and private single room in Hospital View is perfect for someone looking for an affordable and comfortable place to stay.</p>

<p><strong>Rent:</strong> R1,800 per month</p>

<p>The room is neat, easy to maintain, and suitable for one person who wants a peaceful space to call home. It is close to shops, taxis, and other local conveniences, making it ideal for someone who needs quick access to transport.</p>

<p>The property includes a <strong>geyser for hot water</strong> and <strong>safe parking</strong> inside the yard. The area is quiet and secure, offering a relaxed living environment.</p>

<p>Rooms at this price move fast — <strong>contact us soon to secure it before it’s taken!</strong></p>
`,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'hospital-view-bachelor-1': {
      title: 'Hospital View Bachelor',
      price: 'R3,000/month',
      location: 'Hospital View',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-1.jpeg?alt=media&token=e7483557-216a-44ad-9eb6-8c9222cbda4b',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-2.jpeg?alt=media&token=b7e38364-8233-427b-b41a-9871bb7c5fa2',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-3.jpeg?alt=media&token=5538188c-8830-4de8-95c0-03a5446ab40c',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-4.jpeg?alt=media&token=b50f409d-43b0-48b1-b22a-0a02616c47ba',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-5.jpeg?alt=media&token=fea601e6-0a61-42ab-ae18-68a37039a00d',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-6.jpeg?alt=media&token=b30c5af1-0577-4859-a614-64eb621a5340',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-7.jpeg?alt=media&token=4fab6abe-25c7-473f-a3c8-749bb83aa944'

      ],
      description: `<p>This clean and private bachelor in Hospital View is perfect for someone looking for an affordable and comfortable place to stay.</p>

<p><strong>Rent:</strong> R3,000 per month</p>

<p>The unit is neat, easy to maintain, and suitable for one person who wants a peaceful space to call home. It is close to shops, taxis, and other local conveniences, making it ideal for someone who needs quick access to transport.</p>

<p>The property includes a <strong>geyser for hot water</strong> and <strong>safe parking</strong> inside the yard. The area is quiet and secure, offering a relaxed living environment.</p>

<p>Rooms at this price move fast — <strong>contact us soon to secure it before it’s taken!</strong></p>
`,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'thlamathlama-bachelor': {
      title: 'Modern 1 Room Bachelor',
      price: 'R3,500/month',
      location: 'Mayibuye',
      images: ['https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fthlamathlama%2Fthlamathlama-bachelor-picture-3.png?alt=media&token=778a2d82-8f91-4b81-882f-01014c62ad0c',
             'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fthlamathlama%2Fthlamathlama-bachelor-picture-1%20.png?alt=media&token=f5817ee0-a4bb-4bce-9bb8-5d603024240b', 
             'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fthlamathlama%2Fthlamathlama-bachelor-picture-2.png?alt=media&token=8a60b493-0fb5-4490-ae2f-9ad69a1e8c86'],
      description: `<p>One neat and clean room is available right now.</p>

<p><strong>Rent:</strong> R3500 per month<br>
<strong>Deposit:</strong> R3500</p>

<p>This room is good for someone looking for a safe and quiet place to stay. Rooms like this don't stay open for long, so <strong>contact me soon</strong> if you want it.</p>`,
      features: {
        wifi: true,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    '1-Room-difateng-id1': {
      title: 'Difateng 1 Room',
      price: 'R1,300/month',
      location: 'Difateng',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fdifateng%2Fdifateng-1-room-id1-pic-1.png?alt=media&token=b0b69e9f-a7df-471d-aa29-eb3f219067ca',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fdifateng%2Fdifateng-1-room-id1-pic-2.jpeg?alt=media&token=bf3581c6-482b-4f80-a400-1473e1e7f447','https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fdifateng%2Fdifateng-1-room-id1-pic-3.jpeg?alt=media&token=285192e9-c8f9-44c7-9ec9-9d35109f8d87',
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-1-room-id1-pic-2.png?alt=media&token=7b030db7-fd11-4a4f-b93a-79c85d9e6cc9'],
      description: `<p>This 1 room in eNtshonalanga is perfect for someone who wants private space in a quiet and safe area.</p>

<p><strong>Rent:</strong> R1,300 per month</p>

<p>The room is neat and spacious, with enough space for your bed. It is close to local shops and public transport, making it easy to travel to work or school.</p>

<p>There is <strong>Wi-Fi</strong> available. This is a great place for a single person or student who wants comfort and convenience.</p>

<p>Places like this don’t stay empty for long — <strong>contact us soon to book a viewing!</strong>`,
      features: {
        wifi: false,
        geyser: false,
        petsAllowed: false,
        parking: false
      }
    },
    'bachelor-Noordwyk-midrand-1': {
      title: 'Noordwyk bachelor',
      price: 'R6,500/month',
      location: 'Noordwyk',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2FWhatsApp%20Image%202025-12-21%20at%2013.23.20.jpeg?alt=media&token=a5a3ca1d-7f42-4147-9f33-58e9c95c84ee',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2Fnoordwyk-bachelor-2.jpeg?alt=media&token=e1ceba16-d2aa-416d-bf99-c992e1339606', 
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2Fnoordwyk-bachelor-3.jpeg?alt=media&token=66571138-99db-42fa-8c75-c5b9cf42531e',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2Fnoordwyk-bachelor-4.jpeg?alt=media&token=d176f9c0-4bf1-4de2-ab6e-c0454f135d89'],
      description: `<p>This bachelor in Noordwyk, Midrand is perfect for someone who wants a modern and private living space in a quiet and secure area.</p>

<p><strong>Rent:</strong> R6,500 per month</p>

<p>The unit is neat, spacious, and well-maintained, offering enough room for comfortable living. It is close to shopping centres, public transport, schools, and major routes like the N1, making it convenient for professionals and students.</p>

<p>This bachelor is ideal for someone looking for comfort, privacy, and easy access to amenities in Noordwyk.</p>

<p>Places like this in Midrand go quickly — <strong>contact us soon to book a viewing!</strong></p>`,
      features: {
        wifi: true,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'bachelor-Makhulong': {
      title: 'Makhulong bachelor',
      price: 'R3,500/month',
      location: 'Makhulong',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-1.jpeg?alt=media&token=943e662f-8fdc-487a-80a8-82c20dca7474',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-2.jpeg?alt=media&token=51004ef2-9adf-4a69-95f3-d4c8c97241ce', 
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-3.jpeg?alt=media&token=895191d1-869a-4c3f-9384-c69487889b39',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-4.jpeg?alt=media&token=74ecceb1-4620-4d99-9421-e39b9d145a7a',
  'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-5.jpeg?alt=media&token=0e000623-905e-49e9-8d69-3847b0d735ac',
'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-6.jpeg?alt=media&token=dc5c6dd8-c1fd-4cbb-8f80-75f1a55c21f2',
'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-7.jpeg?alt=media&token=8e87ba31-3177-4c86-9e8f-310777a6713c'],
      description: `<p>This bachelor in Makhulong is ideal for someone who wants a clean, private, and affordable living space in a quiet and convenient area.</p>

<p><strong>Rent:</strong> R3,500 per month</p>

<p>The unit is neat and well-maintained, offering enough room for comfortable everyday living. It is close to public transport, local shops, schools, and main routes, making it easy to travel to work or nearby areas.</p>

<p>This bachelor is perfect for a single person or couple looking for privacy, comfort, and easy access to amenities in Makhulong.</p>

<p>Places like this don’t stay available for long — <strong>contact us soon to book a viewing!</strong></p>
`,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'bachelor-Kempton-park-1': {
      title: 'bachelor Kempton Park',
      price: 'R5,500/month',
      location: 'Kempton Park',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-1.jpeg?alt=media&token=fdfa830e-ed60-48e4-831f-cbe2fffaa8c6',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-2.jpeg?alt=media&token=b9369768-8d86-4696-945d-7619f74a5850', 
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-3.jpeg?alt=media&token=345a0cd1-98a6-4f6c-b56f-6f632cd0c75e',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-4.jpeg?alt=media&token=7b573473-ee1d-4d5a-a967-e35b2d0303dd',
  'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-5.jpeg?alt=media&token=dcce4411-b224-4789-b5c1-bbebab85835f'],
      description: `<p>This bachelor in Kempton Park is ideal for someone who wants a clean, private, and affordable living space in a quiet and convenient area.</p>

      <p><strong>Deposit:</strong> R4,000</p>
      <p><strong>Rent:</strong> R5,500 per month</p>

<p>The unit is neat and well-maintained, offering enough room for comfortable everyday living. It is close to public transport, local shops, schools, and main routes, making it easy to travel to work or nearby areas.</p>

<p>This bachelor is perfect for a single person or couple looking for privacy, comfort, and easy access to amenities in Kempton Park.</p>

<p>Places like this don’t stay available for long — <strong>contact us soon to book a viewing!</strong></p>
`,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: true
      }
    },
    'bachelor-birch-acres-1': {
      title: 'Birch Acres',
      price: 'R4,000/month',
      location: 'Birch Acres',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fbirch-acres%2Fbirch-acres-bachelor-4%20(1).jpeg?alt=media&token=37b99a16-6dfd-42d5-96b3-d67d9442e576',
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fbirch-acres%2Fbirch-acres-bachelor-3.jpeg?alt=media&token=9ae1036d-0cbb-433a-b0b5-b8c5b6d915ed', 
      'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fbirch-acres%2Fbirch-acres-bachelor-2.jpeg?alt=media&token=8aa7f814-a115-4f3e-9562-e351c4965064',
    'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fbirch-acres%2Fbirch-acres-bachelor-1.jpeg?alt=media&token=93c21593-f5c0-4c9a-a97c-6feec217c809'],
      description: `<p>This bachelor in Birch Acres is ideal for someone who wants a clean, private, and affordable living space in a quiet and convenient area.</p>

      <p><strong>Deposit:</strong> R4,000</p>
      <p><strong>Rent:</strong> R4,000 per month</p>
      <p><strong>Admin Fee:</strong> R800</p>

      <p>The unit is neat and well-maintained, offering enough room for comfortable everyday living. It is close to public transport, local shops, schools, and main routes, making it easy to travel to work or nearby areas.</p>

      <p>This bachelor is perfect for a single person or couple looking for privacy, comfort, and easy access to amenities in Kempton Park.</p>

      <p>Places like this don’t stay available for long — <strong>contact us soon to book a viewing!</strong></p>
      `,
      features: {
        wifi: false,
        geyser: true,
        petsAllowed: false,
        parking: false
      }
    },
  };
  
  export default apartmentData;