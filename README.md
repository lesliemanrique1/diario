<h1>Diario</h1>

<h2>Overview</h2>
>Diario is a web application that allows you to log your daily activities and memories. You can choose to keep your entries secret or "personal" as well as public, so others can share with you. You may also attach images to your entries, so they all show up in one place. Eventually, I hope to add a "friends" feature, so you can share your entries with specific users. You must be a registered user in order to use this application. Don't worry, your secrets are safe on Diario!

<h2>Data Model</h2>

    // users
    // * our site requires authentication...
    // * so users have a username and password
    // * they also can have 0 or more diaries
    
    var userSchema = new mongoose.Schema({
        email: {
        type: String,
        unique: true,
        required: true
        },
        diaries: {type:[diarySchema]},
        hash: String,
        salt: String

    });

    // * Diaries are required to have a unique name 
    // * Diaries are composed of entries 

    var diarySchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        entries:{type:[entrySchema]}
    })

    // * Entries are required to have a unique title 
    // * Entries contain 0 or more images
    // * permission must be set to public or private

    var entry = new mongoose.Schema({
        title:  {type:String, unique:true; required:[true, '{PATH} is required']}, 
        images: {type:[entryImageSchema]}
        permissions: {type:String, required:[true, '{PATH} is required']}, 

    });

    // * Images are required to have a url

    var entryImageSchema = new mongoose.Schema({
        url: {type:String, required:[true, '{PATH} is required']}, 
    });

    
    
<h2>Wireframes</h2>

/home   -homepage where users can choose to register or login
![Alt text](diario/public/images/FinalProject_home.png?raw=true "homepage")


/home/contact   -contact form to send a message to developers
![Alt text](diario/public/images/FinalProject_contact.png?raw=true "contact us")

/home/login -user login  
/home/register -user register  
![Alt text](diario/public/images/FinalProject_reg_log.png?raw=true "login")

/home/username -userpage is displayed when user is authenticated. 
![Alt text](diario/public/images/FinalProject_userpage.png?raw=true "userpage")

/home/username/entry -entry is displayed when user selects an entry from their userpage 
![Alt text](diario/public/images/FinalProject_entry.png?raw=true "entry")

/home/username/create -create is a form to create a new entry 
![Alt text](diario/public/images/FinalProject_create.png?raw=true "create")

/home/username/explore -explore public posts from other users
![Alt text](diario/public/images/FinalProject_explore.png?raw=true "explore")


<h2>Site Map </h2>
![Alt text](diario/public/images/FinalProject_sitemap.png?raw=true "site map")


<h2>User Stories</h2>
>1. as a user, I can create an entry with optional images, required texts. 
>2. as a user, I can create a Diary. 
>3. as a user, I can set my entry as public or private.
>4. as a user, I can delete and edit entries, including adding or removing images. 
>5. as a user, i can view a series of public entries.
>6. as a user, i can view the contents of one public entry.

<h2>Research Topics</h2>
>1. Integrate user authentication
>2. Nodemailer for contact us form 
>3. Express Validator for validating form entries 


