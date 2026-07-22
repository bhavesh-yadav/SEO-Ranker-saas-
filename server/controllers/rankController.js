import KeywordTracking from "../model/keywordTracking.js";
import { keywordTracking } from "../services/keywordTrackingService.js";
console.log("🔥 rankController loaded");

 // Add a keywork to track
 export const addkeyword = async (req, res) => {
   console.log("🔥 ADD KEYWORD API HIT");
  try {
    const {keyword, url} = req.body;
    if(!keyword || !url) return res.status(400).json({ success: false, message: "Keyword and URL are required" });

// Extract domain from URL

    let domain;
    try {
      const urlObj = new URL(url.startsWith("http")? url: `https://${url}`)
      domain = urlObj.hostname.replace("www", "")

    } catch{
      return res.status(400).json({ success: false, message: "Invalid URL format" });

    }

    // Check if already tracking this keyword+domain
    const existing = await KeywordTracking.findOne({userId: req.userId, keyword: keyword.toLowerCase().trim(), domain});
    if(existing){
      return res.status(400).json({ success: false, message: "Already Tracking this keyword for this domain" });
    }

    // Create tracking entry
    const tracking = await KeywordTracking.create({
      userId: req.userId,
      keyword: keyword.toLowerCase().trim(),
      url: url.startsWith("http") ? url : `https://${url}`,
      domain,
      status: "checking"

    });
    console.log("✅ Tracking created:", tracking._id);
    keywordTracking(tracking);
    res.status(201).json({ success: true, message: " keyword tracking started", tracking });
    


} catch (error) {
    console.error("Add keyword error:", error.message );
    if (error.code === 11000) return res.status(400).json({ success: false, message: " Already tracking this keyword" });
    res.status(500).json({ success: false, message: " Server error" });

}

 }


 // Get all tracked keywords for user
 export const getkeywords = async (req, res) => {
  try {
    const keywords = await KeywordTracking.find({userId: req.userId}).sort({createdAt: -1});
    res.json({success: true, keywords  });

    
  } catch (error) {
     console.error("Add keyword error:", error.message );
     res.status(500).json({ success: false, message: " Server error" });
    
  }
  
 }

 // Get single keyword with fully History
 export const getkeyword = async (req, res) => {
   try {
    const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId});
    if (!tracking) return res.status(404).json({ success: false, message: " keyword tracking not found" });
    res.json({success: true, tracking });
    
    
  } catch (error) {
     console.error("Add keyword error:", error.message );
     res.status(500).json({ success: false, message: " Server error" });
    
  }
  
  
 }


 // Manully refresh a keyword Ranking
 export const refreshkeyword = async (req, res) => {
  try {
    const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId});
    if (!tracking) return res.status(404).json({ success: false, message: " keyword tracking not found" });
    tracking.status = "checking";
    await tracking.save();


    res.json({success: true, message: "Rank check started" });
    keywordTracking(tracking)
    
    
  } catch (error) {
     console.error("Refresh keyword error:", error.message );
     res.status(500).json({ success: false, message: " Server error" });
    
  }
  
  
 }


 // Delete keywork to tracking
 export const deletekeyword = async (req, res) => {
   try {
    const tracking = await KeywordTracking.findByIdAndDelete({_id: req.params.id, userId: req.userId});
    if (!tracking) return res.status(404).json({ success: false, message: " keyword tracking not found" });
   


    res.json({success: true, message: "keyword tracking deleted" });
    
    
    
  } catch (error) {
     console.error("Delete keyword error:", error.message );
     res.status(500).json({ success: false, message: " Server error" });
    
  }
  
  
 }

 //toggle tracking active/inactive
 export const toggletracking = async (req, res) => {
  try {
    const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId});
    if (!tracking) return res.status(404).json({ success: false, message: " keyword tracking not found" });
    tracking.active = !tracking.active;
    await tracking.save();



    res.json({success: true, tracking });
    
    
    
  } catch (error) {
     console.error("Toggle tracking error:", error.message );
     res.status(500).json({ success: false, message: " Server error" });
    
  }
  
  

 }