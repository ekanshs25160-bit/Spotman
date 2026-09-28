export const isAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(401).json({erorr: 'Unauthorized. Please log in first.'})
}
