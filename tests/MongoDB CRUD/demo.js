const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://JihoKim:dyek0511@handbooru.o57njzr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser:true});
const db = client.db("sample_airbnb").collection("listingsAndReviews")
// sample_airbnb라는 데이터베이스의 listingsAndReviews라는 컬렉션을 사용한다.
// 이 부분을 const로 선언하면, 나중에 다른 데이터베이스나 컬렉션을 사용할 때, 수정하기가 편하다.

async function main() {
    const uri = "mongodb+srv://JihoKim:dyek0511@handbooru.o57njzr.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser:true});

    try {
        await client.connect();
        // MongoDB에 연결하기.
        

            //---------MongoDB에 데이터 한개 넣기---------//
            /* await createListing(client, {
                name : "Jiho's House",
                summary : "A cozy place to stay",
                bedrooms : 1,
                bathrooms : 1
            })*/


            //---------MongoDB에 데이터 여러개 넣기---------//
            /* await createMultipleListings(client, [
                {
                    name : "test1's House",
                    summary : "A cozy place to stay",
                    livingroom : 1,
                    bathrooms : 1,
                    kitchen : 1,
                    bedroom : 1,
                },
                {
                    name : "test2's House",
                    summary : "A cozy place to stay",
                    testroom : 1
                }
            ])*/


            //---------MongoDB에서 데이터 하나 찾기---------//
            /* await findOneListingByName(client, "test1's House"); */


            //---------MongoDB에서 특정 데이터 찾기---------//
            /* await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
                minimumNumberOfBedrooms : 1,
                minimumNumberOfBathrooms : 1,
                maximumNumberOfResults : 2
            }); */


            //---------MongoDB에서 데이터 하나 수정하기---------//
            /* await updateListingByName(client, "test1's House", {bedrooms : 2, bathrooms : 1}); */


            //---------MongoDB에서 데이터 하나 수정하거나, 없으면 만들기---------//
            /* await upsertListingByName(client, "test4's House", {bedrooms : 2, bathrooms : 1}); */


            //---------MongoDB에서 데이터 여러개 수정하기---------//
            /* await updateAllListingsToHavePropertyType(client); */

            //---------MongoDB에서 데이터 하나 삭제하기---------//
            await deleteListingByName(client, "test1's House");

    } catch (err) {
        console.log('MongoDB connection error: ' + err);
    } finally {
        await client.close();
    }
}



//------------------------함수 작성란--------------------------//




// MongoDB에 데이터 하나를 넣는 함수
async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne
    (newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
};


// MongoDB에 데이터 여러 개를 넣는 함수
async function createMultipleListings(client, newListings) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany
    (newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
};


// MongoDB에서 데이터 하나를 찾는 함수
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne
    ({name : nameOfListing});

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
};


// MongoDB에서 특정 데이터를 찾는 함수
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER // 최대값
} = {/* 아무 지정도 안하면 앞의 값이 default*/}) {


    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms : {$gte : minimumNumberOfBedrooms}, //gte = "greater than or equal to"
        bathrooms : {$gte : minimumNumberOfBathrooms}
    }).sort({last_review : -1}).limit(maximumNumberOfResults); 
    // -1 = 내림차순, 1 = 오름차순 
    // limit = 최대 몇개까지 보여줄지
    // cursor의 파라미터는 maximumNumberOfResults

    const results = await cursor.toArray();
    // cursor를 배열로 바꿔주고 maxNumberOfResults만큼만 보여준다.

    if (results.length > 0) {
        console.log(`Found ${results.length} listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);   
    }
};


// MongoDB에서 데이터 하나를 업데이트하는 함수
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne
    ({name : nameOfListing}, {$set : updatedListing});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
};



// MongoDB에서 데이터 하나를 업데이트하거나, 없으면 새로 만드는 함수
async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne
    ({name : nameOfListing}, {$set : updatedListing}, {upsert : true});

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
};


// MongoDB에서 데이터 여러개를 업데이트 하는 함수
async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany
    ({property_type : {$exists : false}}, {$set : {property_type : "Unknown"}}); // property_type이 없는 것들을 찾아서 Unknown으로 바꿔라

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


// MongoDB에서 데이터 하나를 삭제하는 함수
async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne
    ({name : nameOfListing});

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
};


// MongoDB에서 데이터 여러개를 삭제하는 함수
async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany
    ({last_scraped : {$lt : date}});
    // last_scraped가 date보다 이전인 것들을 삭제

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
};


main().catch(console.error);


