import db from "../models/index";
import bcrypt from 'bcryptjs';


let handleUserLogin = (email,password) => {
    return new Promise (async(resolve,reject) =>{
        try{
            let userData = {};

            let isExist = await checkUserEmail(email);
            if(isExist){
                //user already exist
                
                let user = await db.User.findOne({
                    where: {email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                });
                if(user){
                    //compare password
                    // bcrypt.compareSync("not_bacon", hash); 
                    let check = await bcrypt.compareSync(password, user.password); 
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = `Ok`;
                        delete user.password;//khong hien thi password o phia client
                        userData.user = user;
                    }
                    else{
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                }
                else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }
               
            }
            else{
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in out system. Pls try other email !`;
            }
            resolve(userData);
        }
        catch(e){
            reject(e)
        }
    });
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve,reject) =>{
        try{
            let user = await db.User.findOne({
                where:{email : userEmail}
            })
            if(user){
                resolve(true)
            }
            else{
                resolve(false)
            }
        }
        catch(e){
            reject(e);
        }
    });
    
}

module.exports = {
    handleUserLogin,
    checkUserEmail
}