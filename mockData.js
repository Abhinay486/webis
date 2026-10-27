// Paste the Google Sheets "Publish to web" CSV URL here.
// Required columns: Full name, Date of birth, Residence, Working as, Contact no, Photo.
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStm6HGC-yfUDXQXel_hoozzVsOaCxHwgoDSvBwj8VvDACkoOWO9u87NCNHO6-j8xoOJ4LZ0VeNhZNr/pub?output=csv";

// Local fallback data keeps the site usable before the sheet URL is configured.
let members = [
  {
    id: "shilaparashetty-krishna",
    name: "శిలపరశెట్టి కృష్ణ",
    dob: "1977-05-19",
    residence: "Anakapalle",
    occupation: "Teacher",
    phone: "9392395216",
    profilePic: "https://drive.google.com/uc?export=view&id=1HNoNi8ckfXKcud6A5Vj6SpyUM8TvwgIA"
  },
  {
    id: "appala-naidu-vegi",
    name: "Appala naidu vegi",
    dob: "1976-05-30",
    residence: "Mindhi (BHPV), Gajuwaka",
    occupation: "Steel plant",
    phone: "7382053675",
    profilePic: "https://drive.google.com/uc?export=view&id=1efPrshVAKxdKsMXgSt6zd4Jk1SjRAKCW"
  },
  {
    id: "bheesetty-seshu",
    name: "Bheesetty. Seshu",
    dob: "1975-11-28",
    residence: "Nagulapalli",
    occupation: "Nagulapalli",
    phone: "8074992014",
    profilePic: "https://drive.google.com/uc?export=view&id=1VyCRrIO6uFueWyeuq4aaq80RZiHqfxBb"
  },
  {
    id: "polamarashitti-lakshminarayana",
    name: "పోలమరశిట్టి లక్ష్మీనారాయణ",
    dob: "1976-01-21",
    residence: "ZPT High School, Munagapaka",
    occupation: "Indian Oil",
    phone: "8121441881",
    profilePic: "https://drive.google.com/uc?export=view&id=1eELqUsTc60_bXGTfS42xw_J5FRxX36Ak"
  },
  {
    id: "pentakota-swami-satyanarayana",
    name: "Pentakota Swami Satyanarayana",
    dob: "1976-11-03",
    residence: "Munagapaka",
    occupation: "Medical",
    phone: "9989328385",
    profilePic: "https://drive.google.com/uc?export=view&id=1pu2ToJAzO9AFW5MIYOZSPr5z8IQmyuo2"
  },
  {
    id: "pentakota-naga-annaappla-naidu",
    name: "PENTAKOTA. NAGA ANNAAPPLA NAIDU",
    dob: "1977-08-31",
    residence: "High School Road, Bojjanakonda, Visakhapatnam",
    occupation: "Wagons workyard (canteen)",
    phone: "9502982666",
    profilePic: "https://drive.google.com/uc?export=view&id=1Y-c3iGcIUBAmMG_DNWzUAFAJDfwvrpcD"
  },
  {
    id: "saragadam-surya-laxmi",
    name: "Saragadam Surya Laxmi",
    dob: "1979-08-12",
    residence: "Handalapalli village, Atchutapuram mandal",
    occupation: "Brandix",
    phone: "9063825429",
    profilePic: "https://drive.google.com/uc?export=view&id=14-AxFhKWnYPE7_leXmpx0zgbv5tMrxuQ"
  },
  {
    id: "vegi-naidu",
    name: "Vegi. Naidu",
    dob: "1977-08-10",
    residence: "Anakapalli",
    occupation: "Farmer",
    phone: "9492224284",
    profilePic: "https://drive.google.com/uc?export=view&id=1uVcQSN5uq7ccXE7M-hi77z6SxtMPOLqO"
  },
  {
    id: "ramakrishna-budida",
    name: "RAMAKRISHNA BUDIDA",
    dob: "1977-03-29",
    residence: "Visakhapatnam",
    occupation: "Architect",
    phone: "9848503009",
    profilePic: "https://drive.google.com/uc?export=view&id=1iLmrCHnTqATIoDJfSJyp_E3OlNbcQgYe"
  },
  {
    id: "umaahshree-sadaram",
    name: "Umaahshree Sadaram",
    dob: "1977-06-03",
    residence: "Thodapeddu Sheddu, Hospital Road, Munagapaka",
    occupation: "Housewife",
    phone: "8712383643",
    profilePic: "https://drive.google.com/uc?export=view&id=1wwXYMcnwK0rlqZvDaPaw1xgTPS8WXODm"
  },
  {
    id: "tekkali-ganesh",
    name: "టెక్కలి. గణేష్",
    dob: "1976-05-31",
    residence: "Vizag",
    occupation: "Loco Pilot (Goods)",
    phone: "7989109199",
    profilePic: "https://drive.google.com/uc?export=view&id=1CsIkfa_WzpIyyUuHIHQvxG80ZoPMT1W-"
  },
  {
    id: "kandregula-nagamanikyal-naidu",
    name: "కాండ్రేగుల నాగమాణిక్యాల నాయుడు",
    dob: "1976-07-01",
    residence: "Timmarajupeta",
    occupation: "Diesel Mechanic",
    phone: "93911191114",
    profilePic: "https://drive.google.com/uc?export=view&id=1j-KG2J1W7_Suu9_PpVfJN3iIW62BugUQ"
  },
  {
    id: "saragadam-krishna-murthy",
    name: "SARAGADAM Krishna Murthy",
    dob: "1975-10-10",
    residence: "Thimmarajupeta",
    occupation: "Cab driver",
    phone: "9392097278",
    profilePic: "https://drive.google.com/uc?export=view&id=1b9typieNWCdFGGtIHX_hDMovAs6cmUj1"
  },
  {
    id: "sanapala-sekhar",
    name: "Sanapala Sekhar",
    dob: "1977-10-23",
    residence: "Srikakulam",
    occupation: "SVC Ramalaxmana Theater Manager",
    phone: "9110300766",
    profilePic: "https://drive.google.com/uc?export=view&id=1z9fMpxgMRX8jHLtPIdUTFb0ZELx9qHEA"
  },
  {
    id: "yellapu-somu-naidu",
    name: "Dr YELLAPU SOMU NAIDU",
    dob: "1977-08-05",
    residence: "Patipalli",
    occupation: "Asst. General Manager, NABARD",
    phone: "7358208934",
    profilePic: "https://drive.google.com/uc?export=view&id=1J25V4J0wXWC8dpzR5dJ7R9MRbBLk3SCH"
  }
];