hotelList = [
    {
        "hotel_id": "1271",
        "name": "Kuala Lumpur",
        "location_id": "390104",
        "city_id": "15",
        "count": "172",
        "latitude": "3.131851406",
        "longitude": "101.6880460918"
    },
    {
        "hotel_id": "285",
        "name": "Sydney",
        "location_id": "4087447",
        "city_id": "5",
        "count": "35",
        "latitude": "-33.8803695251",
        "longitude": "151.1986069472"
    },
    {
        "hotel_id": "417",
        "name": "Bangkok (Other Areas)",
        "location_id": "786505",
        "city_id": "2",
        "count": "358",
        "latitude": "13.7429128535",
        "longitude": "100.6018416093"
    },
    {
        "hotel_id": "2188",
        "name": "Singapore",
        "location_id": "448618",
        "city_id": "8",
        "count": "832",
        "latitude": "1.3132068525",
        "longitude": "103.8597258125"
    },
    {
        "hotel_id": "3535",
        "name": "Hong Kong Island",
        "location_id": "1352348",
        "city_id": "286",
        "count": "243",
        "latitude": "22.2619478608",
        "longitude": "114.1295009851"
    },
    {
        "hotel_id": "3923",
        "name": "Ho Chi Minh City",
        "location_id": "1639198",
        "city_id": "41",
        "count": "266",
        "latitude": "10.7718804693",
        "longitude": "106.6951638156"
    },
    {
        "hotel_id": "4377",
        "name": "Manila",
        "location_id": "1738804",
        "city_id": "90",
        "count": "33",
        "latitude": "14.6075227638",
        "longitude": "120.9730873558"
    },
    {
        "hotel_id": "5164",
        "name": "Taipei-Other Areas",
        "location_id": "2339575",
        "city_id": "18",
        "count": "132",
        "latitude": "25.0807463933",
        "longitude": "121.5617225754"
    },
    {
        "hotel_id": "5176",
        "name": "Jakarta",
        "location_id": "3879586",
        "city_id": "32",
        "count": "740",
        "latitude": "-6.2067251228",
        "longitude": "106.829906702"
    },
    {
        "hotel_id": "5821",
        "name": "Bali (Seminyak/Kerobokan)",
        "location_id": "4268453",
        "city_id": "309",
        "count": "48",
        "latitude": "-8.6722932269",
        "longitude": "115.1625213423"
    },
];

hotelJson = {};
hotelList.forEach(function(item){
    hotelJson[item.hotel_id] = item;
});