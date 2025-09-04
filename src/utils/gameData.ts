import { Treasure, Achievement, Quiz } from '../types/schema';

export const treasures: Treasure[] = [
  {
    id: '0de9d6b9-c969-4ebe-a87e-9e137734c9bc',
    name: {
      hr: 'Banska rezidencija',
      sl: 'Banska rezidenca',
      en: 'Ban\'s Residence'
    },
    description: {
      hr: 'Otkrijte gdje je Ban Jelačić vodio svoje poslove u Novom Dvoru',
      sl: 'Odkrijte, kje je ban Jelačić vodil svoje posle v Novem Dvoru',
      en: 'Discover where Ban Jelačić conducted his business in Novi Dvor'
    },
    location: {
      latitude: 45.8561,
      longitude: 15.8067
    },
    discoveryRadius: 50,
    points: 100,
    unlockOrder: 1,
    historicalInfo: {
      hr: 'Ban Josip Jelačić često je boravio u Novom Dvoru, koji je bio važno upravno središte Zagrebačke županije.',
      sl: 'Ban Josip Jelačić je pogosto prebival v Novem Dvoru, ki je bil pomembno upravno središče Zagrebške županije.',
      en: 'Ban Josip Jelačić often stayed in Novi Dvor, which was an important administrative center of Zagreb County.'
    }
  },
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    name: {
      hr: 'Jezuitska crkva',
      sl: 'Jezuitska cerkev',
      en: 'Jesuit Church'
    },
    description: {
      hr: 'Istražite crkvu gdje se Ban Jelačić molio prije važnih odluka',
      sl: 'Raziščite cerkev, kjer se je ban Jelačić molil pred pomembnimi odločitvami',
      en: 'Explore the church where Ban Jelačić prayed before important decisions'
    },
    location: {
      latitude: 45.8574,
      longitude: 15.8089
    },
    discoveryRadius: 40,
    points: 125,
    unlockOrder: 2,
    historicalInfo: {
      hr: 'Ova barokna crkva bila je duhovni centar za ban Jelačića i njegove suradnike tijekom važnih političkih doba.',
      sl: 'Ta baročna cerkev je bila duhovno središče za ban Jelačića in njegove sodelavce v pomembnih političnih časih.',
      en: 'This baroque church was a spiritual center for Ban Jelačić and his associates during important political times.'
    }
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
    name: {
      hr: 'Stara tržnica',
      sl: 'Stara tržnica',
      en: 'Old Market'
    },
    description: {
      hr: 'Pronađite mjesto gdje su se trgovci sastajali s banom',
      sl: 'Poiščite mesto, kjer so se trgovci srečevali z banom',
      en: 'Find the place where merchants met with the ban'
    },
    location: {
      latitude: 45.8543,
      longitude: 15.8034
    },
    discoveryRadius: 60,
    points: 150,
    unlockOrder: 3,
    historicalInfo: {
      hr: 'Ban Jelačić redovito je posjećivao tržnicu kako bi razgovarao s trgovcima i razumio gospodarske potrebe naroda.',
      sl: 'Ban Jelačić je redno obiskoval tržnico, da se je pogovarjal s trgovci in razumel gospodarske potrebe ljudstva.',
      en: 'Ban Jelačić regularly visited the market to talk with merchants and understand the economic needs of the people.'
    }
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
    name: {
      hr: 'Kraljevski dvorac',
      sl: 'Kraljevi dvorec',
      en: 'Royal Castle'
    },
    description: {
      hr: 'Otkrijte dvorac gdje je Ban planirao obranu Hrvatske',
      sl: 'Odkrijte dvorec, kjer je ban načrtoval obrambo Hrvaške',
      en: 'Discover the castle where Ban planned Croatia\'s defense'
    },
    location: {
      latitude: 45.8598,
      longitude: 15.8123
    },
    discoveryRadius: 45,
    points: 175,
    unlockOrder: 4,
    historicalInfo: {
      hr: 'Iz ovog dvorca Ban Jelačić koordinirao je obranu Hrvatske od mađarske revolucije 1848. godine.',
      sl: 'Iz tega dvorca je ban Jelačić koordiniral obrambo Hrvaške pred madžarsko revolucijo leta 1848.',
      en: 'From this castle, Ban Jelačić coordinated Croatia\'s defense against the Hungarian revolution in 1848.'
    }
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9',
    name: {
      hr: 'Jelačićeva potkova',
      sl: 'Jelačićeva podkev',
      en: 'Jelačić\'s Horseshoe'
    },
    description: {
      hr: 'Završni blago - pronađite legendarnu Jelačićevu potkovu!',
      sl: 'Končni zaklad - poiščite legendarno Jelačićevo podkev!',
      en: 'Final treasure - find the legendary Jelačić\'s Horseshoe!'
    },
    location: {
      latitude: 45.8521,
      longitude: 15.8156
    },
    discoveryRadius: 30,
    points: 200,
    unlockOrder: 5,
    historicalInfo: {
      hr: 'Legenda kaže da je Ban Jelačić ukopao svoju potkovu kao simbol zaštite grada i naroda za buduće generacije.',
      sl: 'Legenda pravi, da je ban Jelačić zakopal svojo podkev kot simbol zaščite mesta in ljudstva za prihodnje generacije.',
      en: 'Legend says that Ban Jelačić buried his horseshoe as a symbol of protection for the city and people for future generations.'
    }
  }
];

export const achievements: Achievement[] = [
  {
    id: '981f0e27-acb0-4ab4-8ad7-8df9eb4e8e2a',
    name: {
      hr: 'Istraživač',
      sl: 'Raziskovalec',
      en: 'Explorer'
    },
    description: {
      hr: 'Otkrijte svoje prvo blago',
      sl: 'Odkrijte svoj prvi zaklad',
      en: 'Discover your first treasure'
    },
    criteria: {
      type: 'treasures_found',
      target: 1
    },
    points: 50,
    iconName: 'location-on'
  },
  {
    id: '2f3e4d5c-6b7a-8980-7e6d-5c4b3a291817',
    name: {
      hr: 'Lovac na blago',
      sl: 'Lovec na zaklade',
      en: 'Treasure Hunter'
    },
    description: {
      hr: 'Otkrijte sva 5 blaga',
      sl: 'Odkrijte vseh 5 zakladov',
      en: 'Discover all 5 treasures'
    },
    criteria: {
      type: 'treasures_found',
      target: 5
    },
    points: 250,
    iconName: 'star'
  },
  {
    id: '3e4d5c6b-7a89-8070-6e5d-4c3b2a190816',
    name: {
      hr: 'Povjesničar',
      sl: 'Zgodovinar',
      en: 'Historian'
    },
    description: {
      hr: 'Ukupno 500 bodova',
      sl: 'Skupno 500 točk',
      en: 'Total 500 points'
    },
    criteria: {
      type: 'total_score',
      target: 500
    },
    points: 100,
    iconName: 'school'
  },
  {
    id: '4d5c6b7a-8980-7061-5e4d-3c2b1a09f815',
    name: {
      hr: 'Savršen kviz',
      sl: 'Popoln kviz',
      en: 'Perfect Quiz'
    },
    description: {
      hr: 'Riješite kviz s 100% točnošću',
      sl: 'Rešite kviz s 100% natančnostjo',
      en: 'Complete a quiz with 100% accuracy'
    },
    criteria: {
      type: 'quiz_perfect'
    },
    points: 75,
    iconName: 'help'
  }
];

export const quizzes: Quiz[] = [
  {
    treasureId: '0de9d6b9-c969-4ebe-a87e-9e137734c9bc',
    questions: [
      {
        id: 'q1-banska',
        question: {
          hr: 'U kojoj je godini Ban Jelačić preuzeo dužnost?',
          sl: 'V katerem letu je ban Jelačić prevzel funkcijo?',
          en: 'In which year did Ban Jelačić assume office?'
        },
        answers: [
          { hr: '1845', sl: '1845', en: '1845' },
          { hr: '1848', sl: '1848', en: '1848' },
          { hr: '1847', sl: '1847', en: '1847' },
          { hr: '1849', sl: '1849', en: '1849' }
        ],
        correctAnswer: 2,
        explanation: {
          hr: 'Ban Jelačić službeno je preuzeo dužnost 1847. godine kao posljednji ban Trojedne Kraljevine.',
          sl: 'Ban Jelačić je uradno prevzel funkcijo leta 1847 kot zadnji ban Trojedinega kraljestva.',
          en: 'Ban Jelačić officially assumed office in 1847 as the last ban of the Triune Kingdom.'
        }
      },
      {
        id: 'q2-banska',
        question: {
          hr: 'Što je bila glavna borba Ban Jelačića?',
          sl: 'Kaj je bil glavni boj ban Jelačića?',
          en: 'What was Ban Jelačić\'s main struggle?'
        },
        answers: [
          { hr: 'Borba protiv Turaka', sl: 'Boj proti Turkom', en: 'Fight against Turks' },
          { hr: 'Obrana od mađarske revolucije', sl: 'Obramba pred madžarsko revolucijo', en: 'Defense against Hungarian revolution' },
          { hr: 'Ujedinjenje južnih Slavena', sl: 'Združitev južnih Slovanov', en: 'Unification of South Slavs' },
          { hr: 'Trgovinski rat', sl: 'Trgovinska vojna', en: 'Trade war' }
        ],
        correctAnswer: 1,
        explanation: {
          hr: 'Ban Jelačić se borio protiv mađarske revolucije 1848. kako bi zaštitio hrvatsku autonomiju.',
          sl: 'Ban Jelačić se je boril proti madžarski revoluciji 1848, da bi zaščitil hrvaško avtonomijo.',
          en: 'Ban Jelačić fought against the Hungarian revolution of 1848 to protect Croatian autonomy.'
        }
      }
    ]
  },
  {
    treasureId: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    questions: [
      {
        id: 'q1-crkva',
        question: {
          hr: 'Koji je stil arhitekture ove crkve?',
          sl: 'Kakšen je slog arhitekture te cerkve?',
          en: 'What is the architectural style of this church?'
        },
        answers: [
          { hr: 'Gotika', sl: 'Gotika', en: 'Gothic' },
          { hr: 'Barok', sl: 'Barok', en: 'Baroque' },
          { hr: 'Renesansa', sl: 'Renesansa', en: 'Renaissance' },
          { hr: 'Romanika', sl: 'Romanika', en: 'Romanesque' }
        ],
        correctAnswer: 1,
        explanation: {
          hr: 'Jezuitska crkva izgrađena je u baroknom stilu, tipičnom za jezuitske crkve 17. i 18. stoljeća.',
          sl: 'Jezuitska cerkev je zgrajena v baročnem slogu, tipičnem za jezuitske cerkve 17. in 18. stoletja.',
          en: 'The Jesuit church was built in the Baroque style, typical of Jesuit churches of the 17th and 18th centuries.'
        }
      }
    ]
  },
  {
    treasureId: '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
    questions: [
      {
        id: 'q1-trznica',
        question: {
          hr: 'Što je Ban Jelačić najčešće kupovao na tržnici?',
          sl: 'Kaj je ban Jelačić najpogosteje kupoval na tržnici?',
          en: 'What did Ban Jelačić most often buy at the market?'
        },
        answers: [
          { hr: 'Oružje', sl: 'Orožje', en: 'Weapons' },
          { hr: 'Hranu za vojsku', sl: 'Hrano za vojsko', en: 'Food for army' },
          { hr: 'Knjige', sl: 'Knjige', en: 'Books' },
          { hr: 'Konje', sl: 'Konje', en: 'Horses' }
        ],
        correctAnswer: 3,
        explanation: {
          hr: 'Ban Jelačić bio je poznat po svojoj ljubavi prema konjima i često je kupovao najbolje konje za svoju vojsku.',
          sl: 'Ban Jelačić je bil znan po svoji ljubezni do konj in pogosto je kupoval najboljše konje za svojo vojsko.',
          en: 'Ban Jelačić was known for his love of horses and often bought the best horses for his army.'
        }
      }
    ]
  },
  {
    treasureId: '3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
    questions: [
      {
        id: 'q1-dvorac',
        question: {
          hr: 'Koliko je vojnika Ban Jelačić vodio u borbu 1848.?',
          sl: 'Koliko vojakov je ban Jelačić vodil v bitko 1848?',
          en: 'How many soldiers did Ban Jelačić lead into battle in 1848?'
        },
        answers: [
          { hr: '25,000', sl: '25.000', en: '25,000' },
          { hr: '40,000', sl: '40.000', en: '40,000' },
          { hr: '15,000', sl: '15.000', en: '15,000' },
          { hr: '60,000', sl: '60.000', en: '60,000' }
        ],
        correctAnswer: 1,
        explanation: {
          hr: 'Ban Jelačić je predvodio okoli 40.000 vojnika u borbi protiv mađarske revolucije.',
          sl: 'Ban Jelačić je vodil okoli 40.000 vojakov v boju proti madžarski revoluciji.',
          en: 'Ban Jelačić led around 40,000 soldiers in the fight against the Hungarian revolution.'
        }
      }
    ]
  },
  {
    treasureId: '4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9',
    questions: [
      {
        id: 'q1-potkova',
        question: {
          hr: 'Zašto je potkova simbol sreće?',
          sl: 'Zakaj je podkev simbol sreče?',
          en: 'Why is a horseshoe a symbol of luck?'
        },
        answers: [
          { hr: 'Zaštićuje od zla', sl: 'Ščiti pred zlom', en: 'Protects from evil' },
          { hr: 'Povezana s konjima', sl: 'Povezana s konji', en: 'Connected to horses' },
          { hr: 'Oblik slova U', sl: 'Oblika črke U', en: 'Shape of letter U' },
          { hr: 'Sve navedeno', sl: 'Vse navedeno', en: 'All of the above' }
        ],
        correctAnswer: 3,
        explanation: {
          hr: 'Potkova je simbol sreće jer zaštićuje konja, ima oblik koji čuva sreću i tradicionalno se smatra zaštitom od zla.',
          sl: 'Podkev je simbol sreče, ker ščiti konja, ima obliko, ki varuje srečo in se tradicionalno šteje za zaščito pred zlom.',
          en: 'A horseshoe is a symbol of luck because it protects the horse, has a shape that holds luck, and is traditionally considered protection from evil.'
        }
      }
    ]
  }
];