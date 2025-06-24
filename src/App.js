import React, { useState, useRef } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TEMPLATES = [
  { label: 'Modern', value: 'modern' },
  { label: 'Classic', value: 'classic' },
  { label: 'Elegant', value: 'elegant' },
];
const THEMES = [
  { label: 'Blue', value: 'theme-blue' },
  { label: 'Green', value: 'theme-green' },
  { label: 'Pink', value: 'theme-pink' },
  { label: 'Light', value: 'theme-light' },
];

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', year: '' }],
    skills: [''],
    social: { linkedin: '', github: '', website: '' },
  });
  const [template, setTemplate] = useState('modern');
  const [theme, setTheme] = useState('theme-blue');
  const [photo, setPhoto] = useState(null);
  const previewRef = useRef();

  // Dynamic handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSocialChange = (e) => {
    setForm({ ...form, social: { ...form.social, [e.target.name]: e.target.value } });
  };
  const handleEduChange = (i, e) => {
    const newEdu = [...form.education];
    newEdu[i][e.target.name] = e.target.value;
    setForm({ ...form, education: newEdu });
  };
  const handleExpChange = (i, e) => {
    const newExp = [...form.experience];
    newExp[i][e.target.name] = e.target.value;
    setForm({ ...form, experience: newExp });
  };
  const handleSkillChange = (i, e) => {
    const newSkills = [...form.skills];
    newSkills[i] = e.target.value;
    setForm({ ...form, skills: newSkills });
  };
  // Add/Remove
  const addEdu = () => setForm({ ...form, education: [...form.education, { school: '', degree: '', year: '' }] });
  const removeEdu = (i) => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });
  const addExp = () => setForm({ ...form, experience: [...form.experience, { company: '', role: '', year: '' }] });
  const removeExp = (i) => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });
  const addSkill = () => setForm({ ...form, skills: [...form.skills, ''] });
  const removeSkill = (i) => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });

  // Photo upload
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleDownloadPDF = async () => {
    const input = previewRef.current;
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('resume.pdf');
  };

  // Helper to filter out empty entries
  const nonEmptyEducation = form.education.filter(
    (edu) => edu.school || edu.degree || edu.year
  );
  const nonEmptyExperience = form.experience.filter(
    (exp) => exp.company || exp.role || exp.year
  );
  const nonEmptySkills = form.skills.filter((skill) => skill && skill.trim() !== '');

  return (
    <div className={`layout-root ${theme}`}>
      <header className="app-header">
        <span className="app-title">Resume Builder</span>
        <div className="theme-switcher">
          <span>Theme:</span>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            {THEMES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="main-content">
        <div className="form-column">
          <form className="resume-form scrollable-form">
            <label>
              Profile Photo
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} />
            </label>
            <label>
              Email
              <input name="email" value={form.email} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <div className="dynamic-section">
              <span>Education</span>
              {form.education.map((edu, i) => (
                <div key={i} className="dynamic-entry">
                  <input name="school" placeholder="School" value={edu.school} onChange={e => handleEduChange(i, e)} />
                  <input name="degree" placeholder="Degree" value={edu.degree} onChange={e => handleEduChange(i, e)} />
                  <input name="year" placeholder="Year" value={edu.year} onChange={e => handleEduChange(i, e)} />
                  {form.education.length > 1 && <button type="button" onClick={() => removeEdu(i)}>-</button>}
                </div>
              ))}
              <button type="button" onClick={addEdu}>Add Education</button>
            </div>
            <div className="dynamic-section">
              <span>Experience</span>
              {form.experience.map((exp, i) => (
                <div key={i} className="dynamic-entry">
                  <input name="company" placeholder="Company" value={exp.company} onChange={e => handleExpChange(i, e)} />
                  <input name="role" placeholder="Role" value={exp.role} onChange={e => handleExpChange(i, e)} />
                  <input name="year" placeholder="Year" value={exp.year} onChange={e => handleExpChange(i, e)} />
                  {form.experience.length > 1 && <button type="button" onClick={() => removeExp(i)}>-</button>}
                </div>
              ))}
              <button type="button" onClick={addExp}>Add Experience</button>
            </div>
            <div className="dynamic-section">
              <span>Skills</span>
              {form.skills.map((skill, i) => (
                <div key={i} className="dynamic-entry">
                  <input placeholder="Skill" value={skill} onChange={e => handleSkillChange(i, e)} />
                  {form.skills.length > 1 && <button type="button" onClick={() => removeSkill(i)}>-</button>}
                </div>
              ))}
              <button type="button" onClick={addSkill}>Add Skill</button>
            </div>
            <div className="dynamic-section">
              <span>Social Links</span>
              <input name="linkedin" placeholder="LinkedIn" value={form.social.linkedin} onChange={handleSocialChange} />
              <input name="github" placeholder="GitHub" value={form.social.github} onChange={handleSocialChange} />
              <input name="website" placeholder="Website" value={form.social.website} onChange={handleSocialChange} />
            </div>
            <label>
              Template
              <select value={template} onChange={handleTemplateChange}>
                {TEMPLATES.map((tpl) => (
                  <option key={tpl.value} value={tpl.value}>{tpl.label}</option>
                ))}
              </select>
            </label>
          </form>
        </div>
        <div className="preview-column">
          <div className="sticky-preview">
            <div style={{ width: '100%' }}>
              <div ref={previewRef}>
                {template === 'modern' ? (
                  <div className="resume-preview resume-modern">
                    {photo && <img src={photo} alt="Profile" className="profile-photo" />}
                    <h1>{form.name || 'Your Name'}</h1>
                    <p>{form.email || 'your.email@example.com'} | {form.phone || '123-456-7890'}</p>
                    <section>
                      <h2>Education</h2>
                      {nonEmptyEducation.length > 0 ? (
                        nonEmptyEducation.map((edu, i) => (
                          <p key={i}><b>{edu.degree}</b> at {edu.school} {edu.year && `(${edu.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No education added.</p>
                      )}
                    </section>
                    <section>
                      <h2>Experience</h2>
                      {nonEmptyExperience.length > 0 ? (
                        nonEmptyExperience.map((exp, i) => (
                          <p key={i}><b>{exp.role}</b> at {exp.company} {exp.year && `(${exp.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No experience added.</p>
                      )}
                    </section>
                    <section>
                      <h2>Skills</h2>
                      {nonEmptySkills.length > 0 ? (
                        <ul>
                          {nonEmptySkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#aaa' }}>No skills added.</p>
                      )}
                    </section>
                    <section>
                      <h2>Social</h2>
                      <ul>
                        {form.social.linkedin && <li>LinkedIn: {form.social.linkedin}</li>}
                        {form.social.github && <li>GitHub: {form.social.github}</li>}
                        {form.social.website && <li>Website: {form.social.website}</li>}
                      </ul>
                    </section>
                  </div>
                ) : template === 'classic' ? (
                  <div className="resume-preview resume-classic">
                    {photo && <img src={photo} alt="Profile" className="profile-photo" />}
                    <h1 className="classic-title">{form.name || 'Your Name'}</h1>
                    <div className="classic-contact">
                      <span>{form.email || 'your.email@example.com'}</span> | <span>{form.phone || '123-456-7890'}</span>
                    </div>
                    <hr />
                    <div className="classic-section">
                      <h2>Education</h2>
                      {nonEmptyEducation.length > 0 ? (
                        nonEmptyEducation.map((edu, i) => (
                          <p key={i}><b>{edu.degree}</b> at {edu.school} {edu.year && `(${edu.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No education added.</p>
                      )}
                    </div>
                    <div className="classic-section">
                      <h2>Experience</h2>
                      {nonEmptyExperience.length > 0 ? (
                        nonEmptyExperience.map((exp, i) => (
                          <p key={i}><b>{exp.role}</b> at {exp.company} {exp.year && `(${exp.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No experience added.</p>
                      )}
                    </div>
                    <div className="classic-section">
                      <h2>Skills</h2>
                      {nonEmptySkills.length > 0 ? (
                        <ul>
                          {nonEmptySkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#aaa' }}>No skills added.</p>
                      )}
                    </div>
                    <div className="classic-section">
                      <h2>Social</h2>
                      <ul>
                        {form.social.linkedin && <li>LinkedIn: {form.social.linkedin}</li>}
                        {form.social.github && <li>GitHub: {form.social.github}</li>}
                        {form.social.website && <li>Website: {form.social.website}</li>}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="resume-preview resume-elegant">
                    {photo && <img src={photo} alt="Profile" className="profile-photo" />}
                    <div className="elegant-header">
                      <h1>{form.name || 'Your Name'}</h1>
                      <div className="elegant-contact">
                        <span>{form.email || 'your.email@example.com'}</span> | <span>{form.phone || '123-456-7890'}</span>
                      </div>
                    </div>
                    <div className="elegant-section">
                      <h2>Education</h2>
                      {nonEmptyEducation.length > 0 ? (
                        nonEmptyEducation.map((edu, i) => (
                          <p key={i}><b>{edu.degree}</b> at {edu.school} {edu.year && `(${edu.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No education added.</p>
                      )}
                    </div>
                    <div className="elegant-section">
                      <h2>Experience</h2>
                      {nonEmptyExperience.length > 0 ? (
                        nonEmptyExperience.map((exp, i) => (
                          <p key={i}><b>{exp.role}</b> at {exp.company} {exp.year && `(${exp.year})`}</p>
                        ))
                      ) : (
                        <p style={{ color: '#aaa' }}>No experience added.</p>
                      )}
                    </div>
                    <div className="elegant-section">
                      <h2>Skills</h2>
                      {nonEmptySkills.length > 0 ? (
                        <ul>
                          {nonEmptySkills.map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#aaa' }}>No skills added.</p>
                      )}
                    </div>
                    <div className="elegant-section">
                      <h2>Social</h2>
                      <ul>
                        {form.social.linkedin && <li>LinkedIn: {form.social.linkedin}</li>}
                        {form.social.github && <li>GitHub: {form.social.github}</li>}
                        {form.social.website && <li>Website: {form.social.website}</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <button className="download-pdf-btn" onClick={handleDownloadPDF} type="button">Download as PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
