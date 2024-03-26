const Candidate = require('../models/Candidate');

const User = require('../models/User');

const checkAdminRole = async function(userId){
    try {
        const user = await User.findById(userId)
        return user && user.role === "admin";
    } catch (error) {
        throw new Error("Error checking admin role");
    }

}


exports.AddCandidates = async function(req,res){
    try {
        
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }

        const data = req.body;
        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json(response);


    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.updateCandidate = async function(req,res){
    try {
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }
            

        const candidateId = req.params.candidateId;
        const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId,updateCandidateData,{
            new:true,
            runValidators:true
        })

        if(!response){
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.deleteCandidate = async function(req,res){
    try {
        if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }

        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);
        
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log("Candidate deleted");
        return res.status(200).json({"Candidate Deleted": response});
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }

}


exports.voteCandidate = async function(req,res){
    const candidateId = req.params.candidateId;
        const userId = req.user.id;
    
        try{
            // Find the Candidate document with the specified candidateID
            const candidate = await Candidate.findById(candidateId);
            if(!candidate){
                return res.status(404).json({ message: 'Candidate not found' });
            }
    
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({ message: 'user not found' });
            }
            if(user.role == 'admin'){
                return res.status(403).json({ message: 'admin is not allowed'});
            }
            if(user.isVoted){
                return res.status(400).json({ message: 'You have already voted' });
            }
    
            // Update the Candidate document to record the vote
            candidate.votes.push({user: userId})
            candidate.voteCount++;
            await candidate.save();
    
            // update the user document
            user.isVoted = true
            await user.save();
    
            return res.status(200).json({ message: 'Vote recorded successfully' });
        }catch(err){
            console.log(err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    };



exports.voteCount = async function(req,res){
try {
    const candidate = await Candidate.find().sort({voteCount:'desc'});
    const voterecord = candidate.map((data=>{
        return {
            party:data.party,
            count:data.voteCount
        }
    }))

    return res.status(200).json(voterecord)
}


catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
}
}

exports.getAllCandidates = async function(req,res){
   try {
     const candidate = await Candidate.find()
 
     const response = candidate.map((data=>{
         return {
             name:data.name,
             party:data.party,
             

         }
     }))
 
     return res.status(200).json(response);
   } 
   
   catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
   }

}











