const isLogged = async (req , res , next)=>{
    try {
        if(req.session.useremail){
            res.redirect("/");
            next()
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = isLogged;