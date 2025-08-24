const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load data once when server starts
let candidatesData = [];
try {
  const dataPath = path.join(__dirname, '..', 'data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  candidatesData = JSON.parse(rawData);
  console.log(`Loaded ${candidatesData.length} candidates`);
} catch (error) {
  console.error('Error loading data:', error);
}

// Endpoints
app.get('/api/candidates', (req, res) => {
  const { 
    page = 1, 
    limit = 20,
    skills,
    skillMatchType = 'any',
    minExperience,
    education,
    location,
    name,
    company,
    roleName,
    minSalary,
    maxSalary
  } = req.query;
  
  let filteredCandidates = [...candidatesData];
  
  // Calculate match scores and apply filters
  if (skills) {
    const skillsList = skills.split(',');
    
    // First calculate match scores for all candidates
    filteredCandidates = filteredCandidates.map(candidate => {
      let matchScore = 0;
      let matchDetails = { skillsMatch: 0, totalSkills: skillsList.length };
      
      if (candidate.skills && candidate.skills.length > 0) {
        // Count how many of the requested skills the candidate has
        let matchedSkills = 0;
        skillsList.forEach(skill => {
          if (candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )) {
            matchedSkills++;
          }
        });
        
        matchDetails.skillsMatch = matchedSkills;
        // Calculate percentage match
        matchScore = Math.round((matchedSkills / skillsList.length) * 100);
      }
      
      return { 
        ...candidate, 
        matchScore,
        matchDetails
      };
    });
    
    if (skillMatchType === 'all') {
      // Match all skills (AND logic)
      filteredCandidates = filteredCandidates.filter(candidate => 
        candidate.skills && skillsList.every(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    } else {
      // Match any skills (OR logic) - keep only candidates with at least one match
      filteredCandidates = filteredCandidates.filter(candidate => 
        candidate.skills && skillsList.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
  } else {
    // If no skills specified, everyone gets 100% match
    filteredCandidates = filteredCandidates.map(candidate => ({
      ...candidate,
      matchScore: 100,
      matchDetails: { skillsMatch: 0, totalSkills: 0 }
    }));
  }
  
  if (minExperience) {
    const minExp = parseInt(minExperience);
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.work_experiences && candidate.work_experiences.length >= minExp
    );
  }
  
  if (education) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.education && candidate.education.highest_level === education
    );
  }
  
  if (location) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.location && candidate.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // New filters
  if (name) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.name && candidate.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  if (company) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.work_experiences && candidate.work_experiences.some(exp => 
        exp.company.toLowerCase().includes(company.toLowerCase())
      )
    );
  }
  
  if (roleName) {
    filteredCandidates = filteredCandidates.filter(candidate => 
      candidate.work_experiences && candidate.work_experiences.some(exp => 
        exp.roleName.toLowerCase().includes(roleName.toLowerCase())
      )
    );
  }
  
  if (minSalary || maxSalary) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      if (!candidate.annual_salary_expectation || !candidate.annual_salary_expectation["full-time"]) {
        return false;
      }
      
      const salaryStr = candidate.annual_salary_expectation["full-time"];
      const salary = parseInt(salaryStr.replace(/[^0-9]/g, ''));
      
      if (minSalary && salary < parseInt(minSalary)) {
        return false;
      }
      
      if (maxSalary && salary > parseInt(maxSalary)) {
        return false;
      }
      
      return true;
    });
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    total: filteredCandidates.length,
    page: parseInt(page),
    limit: parseInt(limit),
    candidates: filteredCandidates.slice(startIndex, endIndex)
  };
  
  res.json(results);
});

// Get candidate by ID (email as ID)
app.get('/api/candidates/:email', (req, res) => {
  const { email } = req.params;
  const candidate = candidatesData.find(c => c.email === email);
  
  if (!candidate) {
    return res.status(404).json({ message: 'Candidate not found' });
  }
  
  res.json(candidate);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});