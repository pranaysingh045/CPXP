import React from 'react'

// export default function Settings() {
//   return (
//     <div>Settings</div>
//   )
// }


// import '../CSS/postnewjob.css'
import Select from 'react-select';
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
const jdTemplate = [
  { value: 'Select Country', label: 'Select Country' },
  { value: 'Java Dev', label: 'Java Dev' },
  { value: 'Tester', label: 'Tester' },
  { value: 'Recruitment Specialist', label: 'Recruitment Specialist' },
  { value: 'Software developer .net', label: 'Software developer .net' }
];
const jobTypeValues = [
  { value: 'Please Select', label: 'Please Select' },
  { value: 'Full Time', label: 'Full Time' },
  { value: 'Part Time', label: 'Part Time' },
  { value: 'Freelancer', label: 'Freelancer' },
  { value: 'Other', label: 'Other' },
];
const initialState = {
  country: [],
  industry: [],
  selectedCountry: null,
  selectedIndustry: null,
  jdTemplateValue: null,
  jobValue: null,
  skills: [],
  input: '',
  dropdownSelectedValue: '',
  clicked: false,
  results: [],
  showDropdownReqSkill:false
};
 
function reducer(state, action) {
  switch (action.type) {
    case 'SET_COUNTRY':
      let countries = [];
      countries = action.payload.map(opt => ({ label: opt.name, value: opt.id }));
      return { ...state, country: [...countries] }
    case 'SET_INDUSTRY':
      let industries = [];
      industries = action.payload.map(opt => ({ label: opt.name, value: opt.id }));
      return { ...state, industry: [...industries] }
    case 'SET_SELECTED_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'SET_SELECTED_INDUSTRY':
      return { ...state, selectedIndustry: action.payload };
    case 'SET_JD_TEMPLATE_VALUE':
      return { ...state, jdTemplateValue: action.payload };
    case 'SET_JOB_VALUE':
      return { ...state, jobValue: action.payload };
    case 'ADD_INPUT':
      return { ...state, input: action.payload };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: (!state.skills.includes(state.input) && state.input.trim() !== '') ? [...state.skills, state.input] : state.skills,
        input: state.skills.includes(state.input) ? '' : state.input
      }
    case 'REMOVE_SKILL':
      const filtered = state.skills.filter((skill) => (
        skill != action.payload
      ))
      return { ...state, skills: [...filtered] }
    case 'SET_RESULTS':
      console.log(action.payload)
      return { ...state, results: action.payload }
 
    case 'DROPDOWN_CLICKED':
      return { ...state, dropdownSelectedValue: action.payload, clicked: true }
    case 'showDropdownReqSkill':
      return {...state,showDropdownReqSkill:action.payload}
    default:
      return state;
  }
}
 
export default function Settings(){
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [results, setResults] = useState([]);
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const baseUrl = 'https://rdts.talentrackr.com/cpxpapi/api/Industry/getIndustries';
        const response = await axios.get(baseUrl);
        if (response.status === 200) {
          dispatch({ type: 'SET_INDUSTRY', payload: response.data.data });
        }
      } catch (err) {
        console.log('Error fetching industries:', err);
      }
    };
    fetchIndustries();
  }, []);
 
  const handleChangeIndustry = (selectedOption) => {
    dispatch({ type: 'SET_SELECTED_INDUSTRY', payload: selectedOption });
  };
 
  const extractJdTemplate = (selectedOption) => {
    dispatch({ type: 'SET_JD_TEMPLATE_VALUE', payload: selectedOption });
  };
 
  const handleJobType = (selectedOption) => {
    dispatch({ type: 'SET_JOB_VALUE', payload: selectedOption });
  };
  const fetchData = (value) => {
    fetch('https://jsonplaceholder.typicode.com/comments').then((response) => response.json().then(json => {
      const results = json.filter((user) => {
        return value && user && user.name && user.name.toLowerCase().includes(value);
      })
      // setResults(results);
      dispatch({ type: 'SET_RESULTS', payload: results })
    }))
  }
  const handleDropDownClick = (selectedValue) => {
    dispatch({ type: 'DROPDOWN_CLICKED', payload: selectedValue });
    dispatch({type:'showDropdownReqSkill',payload:false});
  }
  const handleChangeInput = (valu) => {
    dispatch({ type: 'ADD_INPUT', payload: valu });
    dispatch({type:'showDropdownReqSkill',payload:true});
    //functionality to search by using some default skills before we get API
    fetchData(valu);
  };
  const handleButtonSkill = () => {
    dispatch({ type: 'ADD_SKILL', payload: state.input });
    dispatch({type:'showDropdownReqSkill',payload:false});

  };
  const removeSkill = (skillRemoved) => {
    dispatch({ type: 'REMOVE_SKILL', payload: skillRemoved });
  }
  const limitNumericInput = (event, item) => {
    const placeholder = event.target.value
    if (placeholder !== '' && placeholder.length > item) {
      placeholder = placeholder.slice(0, item);
    }
 
  }
  return (
    <>
      <div className="container">
        <h2 className="top">Basic Information</h2>
        <div className='dropdown_flex'>
        </div>
        <form type='submit'>
          <div className='email_flex'>
            <div className="City form-group col-md-6">
              <label htmlFor="inputEmail4">City<span className='asterisk'>*</span></label>
              <input required className="control_width form-control" />
            </div>
            <div className="jobTitle form-group col-md-6">
              <label htmlFor="inputPassword4">Job Title<span className='asterisk'>*</span></label>
              <input required className="control_width form-control" />
            </div>
          </div>
          <div className='email_flex'>
            <div className="Openings form-group col-md-6">
              <label htmlFor="inputEmail4">No. of Openings<span className='asterisk'>*</span></label>
              <input required className="control_width form-control" />
            </div>
            <div className='dropdownClass Category dropdown'>
              <label>Category<span className='asterisk'>*</span></label>
              <Select required className='control_width' options={state.industry} onChange={handleChangeIndustry} value={state.selectedIndustry} />
            </div>
          </div>
          <div className='email_flex'>
            <div className="inputFields form-group col-md-6">
              <label htmlFor="inputEmail4">Required Experience (yrs):</label>
              <div className='two_inputs'>
                <input type='number' className="control_width form-control" placeholder='Minimum' />
                <input type='number' className="control_width1 form-control" placeholder='Maximum' />
              </div>
            </div>
            <div className="inputFields salaryRange form-group col-md-6">
              <label htmlFor="inputPassword4">Annual Salary Range</label>
              <div className='two_inputs'>
                <input onInput={(event) => limitNumericInput(event, 5)} type='number' className="control_width form-control" placeholder='Minimum' />
                <input type='number' className="control_width1 form-control" placeholder='Maximum' />
              </div>
            </div>
          </div>
          <div className="skills form-group">
            <label htmlFor="inputAddress">Required Skills</label>
            <div className='button_flex'>
              {/* modify the value attribute here, we need to show result.name instead, hence we need to handle that using two different states. One is for setting true and false and other is for holding input */}
              <input
                value={state.input}
                type="text"
                className="RequiredSkills form-control"
                id="inputAddress"
                onChange={(event) => {
                  handleChangeInput(event.target.value);
                  
 
                }}
              />
 
              <button onClick={handleButtonSkill} type="button" className="hoverChange info_button btn btn-info">Add Skills</button>
            </div>
            <div className='result_list'>
              { state.showDropdownReqSkill && state.input && state.results.map((result, id) => (
                <div onClick={()=>{handleChangeInput(result.name);}} key={id}>
                  {result.name}
                </div>
              ))}
            </div>
            <div className='addSkills'>
              {state.skills.map((element, index) => (
                <div className='addSkillsInside' key={index}>
                  <span className='skillElement'>{element}</span>
                  <button type='button' className='closeButton' onClick={() => removeSkill(element)}>×</button>
                </div>
              ))}
            </div>
          </div>
          <div className='JobType'>
            <label>Job Type<span className='asterisk'>*</span></label>
            <Select required className='jobType' options={jobTypeValues} onChange={handleJobType} value={state.jobValue} />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Job Highlights (300 characters allow) <span className='asterisk'>*</span></label>
            <textarea required className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <h4>Job Description</h4>
          <div className='JobType'>
            <label style={{ marginBottom: '0.3rem' }}>Predefined Job Description<span className='asterisk'>*</span></label>
            <Select required className='jobType' options={jdTemplate} onChange={extractJdTemplate} value={state.jdTemplateValue} />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Detail Job Description<span className='asterisk'>*</span></label>
            <textarea required className="form-control" id="exampleFormControlTextarea1" rows="6"></textarea>
          </div>
          <button type="submit" className="hoverChange occupyWidth btn btn-info">Publish</button>
        </form >
      </div >
    </>
  );
}
 
