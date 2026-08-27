  /* ---------- theme ---------- */
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ascend-theme', theme);
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  const savedTheme = localStorage.getItem('ascend-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- toast ---------- */
  const statusMsg = document.getElementById('statusMsg');
  function showToast(text){
    document.getElementById('statusMsgText').textContent = text;
    statusMsg.classList.add('show');
    setTimeout(() => statusMsg.classList.remove('show'), 3200);
  }

  /* ---------- step content for left panel ---------- */
  const stepCopy = {
    1: { kicker:'Step 1 of 4', h:"Let's set up your profile.", p:"A few quick details help Ascend personalise your skill-gap analysis, weekly plan and mock interviews from the very first session." },
    2: { kicker:'Step 2 of 4', h:'Point us at your goal.', p:'Your target role and company decide which skills, questions and companies your prep plan is built around.' },
    3: { kicker:'Step 3 of 4', h:"What you bring today.", p:'Listing your current skills lets the Skill Gap Engine show exactly what to learn next — nothing you already know.' },
    4: { kicker:'Step 4 of 4', h:'Last step — add your resume.', p:'Your resume is required to generate an accurate ATS Compatibility Score and skill-gap match against your target role.' },
    5: { kicker:'All done', h:'Welcome to Ascend.', p:'Your personalised weekly plan is being generated in the background — it will be ready on your dashboard.' }
  };

  let currentStep = 1;

  function goStep(n){
    currentStep = n;
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel == n));
    document.querySelectorAll('.step-item').forEach(s => {
      const sn = parseInt(s.dataset.step);
      s.classList.toggle('active', sn === n);
      s.classList.toggle('done', sn < n);
    });
    const c = stepCopy[n] || stepCopy[4];
    document.getElementById('brandKicker').textContent = c.kicker;
    document.getElementById('brandHeadline').textContent = c.h;
    document.getElementById('brandSub').textContent = c.p;
    document.getElementById('skipLink').style.display = (n >= 4) ? 'none' : 'block';

    const mSpans = document.querySelectorAll('#progressMobile span');
    mSpans.forEach((s, i) => s.classList.toggle('on', i < n));

    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ---------- single-select chip groups ---------- */
  function setupChipGroup(id){
    const group = document.getElementById(id);
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        group.classList.remove('has-error');
      });
    });
  }
  setupChipGroup('statusChips');
  setupChipGroup('roleChips');

  /* "Other" role reveals an inline text field instead of a browser prompt */
  const otherRoleChip = document.getElementById('otherRoleChip');
  const otherRoleInputWrap = document.getElementById('otherRoleInputWrap');
  const otherRoleInput = document.getElementById('otherRoleInput');
  otherRoleChip.addEventListener('click', () => {
    otherRoleInputWrap.classList.add('show');
    otherRoleInput.focus();
  });
  document.querySelectorAll('#roleChips .chip:not(.custom-chip)').forEach(chip => {
    chip.addEventListener('click', () => {
      otherRoleInputWrap.classList.remove('show');
    });
  });
  otherRoleInput.addEventListener('input', () => {
    document.getElementById('roleChips').classList.remove('has-error');
    document.getElementById('roleError').classList.remove('show');
  });

  /* ---------- multi-select company chips ---------- */
  const selectedCompanies = new Set();
  const companyChipsGroup = document.getElementById('companyChips');
  companyChipsGroup.querySelectorAll('.chip:not(.custom-chip)').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      chip.classList.toggle('multi');
      const v = chip.dataset.value;
      if(chip.classList.contains('selected')) selectedCompanies.add(v);
      else selectedCompanies.delete(v);
    });
  });

  const otherCompanyChip = document.getElementById('otherCompanyChip');
  const otherCompanyInputWrap = document.getElementById('otherCompanyInputWrap');
  const companyOtherInput = document.getElementById('companyOtherInput');
  const companyTagWrap = document.getElementById('companyTagWrap');
  otherCompanyChip.addEventListener('click', () => {
    otherCompanyInputWrap.classList.add('show');
    companyOtherInput.focus();
  });

  function addCompanyTag(value){
    const v = value.trim();
    if(!v || selectedCompanies.has(v)) return;
    selectedCompanies.add(v);
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${v} <button type="button" aria-label="Remove ${v}">✕</button>`;
    tag.querySelector('button').addEventListener('click', () => {
      selectedCompanies.delete(v);
      tag.remove();
    });
    companyTagWrap.insertBefore(tag, companyOtherInput);
  }
  companyOtherInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      addCompanyTag(companyOtherInput.value);
      companyOtherInput.value = '';
    }
  });

  /* ---------- required-field validation ---------- */
  function validateStep1(){
    let valid = true;
    const nameInput = document.getElementById('fullName');
    const nameError = document.getElementById('fullNameError');
    if(nameInput.value.trim().length === 0){
      nameError.classList.add('show');
      nameInput.classList.add('error');
      valid = false;
    } else {
      nameError.classList.remove('show');
      nameInput.classList.remove('error');
    }

    const statusGroup = document.getElementById('statusChips');
    const statusError = document.getElementById('statusError');
    const statusSelected = statusGroup.querySelector('.chip.selected');
    if(!statusSelected){
      statusGroup.classList.add('has-error');
      statusError.classList.add('show');
      valid = false;
    } else {
      statusGroup.classList.remove('has-error');
      statusError.classList.remove('show');
    }

    if(valid) goStep(2);
  }

  function validateStep2(){
    let valid = true;
    const roleGroup = document.getElementById('roleChips');
    const roleError = document.getElementById('roleError');
    const roleSelected = roleGroup.querySelector('.chip.selected');
    const otherRoleFilled = otherRoleInputWrap.classList.contains('show') && otherRoleInput.value.trim().length > 0;
    if(!roleSelected && !otherRoleFilled){
      roleGroup.classList.add('has-error');
      roleError.classList.add('show');
      valid = false;
    } else {
      roleGroup.classList.remove('has-error');
      roleError.classList.remove('show');
    }

    if(valid) goStep(3);
  }

  /* ---------- skills tag input ---------- */
  const tagWrap = document.getElementById('tagWrap');
  const skillInput = document.getElementById('skillInput');
  const addedSkills = new Set();

  function addSkill(value){
    const v = value.trim();
    if(!v || addedSkills.has(v.toLowerCase())) return;
    addedSkills.add(v.toLowerCase());
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${v} <button type="button" aria-label="Remove ${v}">✕</button>`;
    tag.querySelector('button').addEventListener('click', () => {
      addedSkills.delete(v.toLowerCase());
      tag.remove();
    });
    tagWrap.insertBefore(tag, skillInput);
  }

  skillInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      addSkill(skillInput.value);
      skillInput.value = '';
    }
  });

  /* ---------- resume upload ---------- */
  const dropzone = document.getElementById('dropzone');
  const resumeFile = document.getElementById('resumeFile');
  const filePreview = document.getElementById('filePreview');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const fileRemove = document.getElementById('fileRemove');

  function showFile(file){
    if(!file) return;
    const okType = /pdf|jpe?g|png/i.test(file.type) || /\.(pdf|jpe?g|png)$/i.test(file.name);
    const okSize = file.size <= 5 * 1024 * 1024;
    if(!okType){ showToast("Please upload a PDF, JPG or PNG file."); resumeFile.value = ''; return; }
    if(!okSize){ showToast("That file is over 5 MB — please upload a smaller one."); resumeFile.value = ''; return; }
    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024).toFixed(0) + ' KB';
    filePreview.classList.add('show');
    dropzone.style.display = 'none';
    document.getElementById('resumeError').classList.remove('show');
  }
  resumeFile.addEventListener('change', () => showFile(resumeFile.files[0]));

  ['dragenter','dragover'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault(); dropzone.classList.add('drag');
  }));
  ['dragleave','drop'].forEach(evt => dropzone.addEventListener(evt, (e) => {
    e.preventDefault(); dropzone.classList.remove('drag');
  }));
  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if(file){ resumeFile.files = e.dataTransfer.files; showFile(file); }
  });
  fileRemove.addEventListener('click', () => {
    resumeFile.value = '';
    filePreview.classList.remove('show');
    dropzone.style.display = 'block';
  });

  /* ---------- skip / finish ---------- */
  document.getElementById('skipLink').addEventListener('click', (e) => {
    e.preventDefault();
    showToast("You can finish this anytime from Settings.");
    goStep(5);
  });

  function finishSetup(){
    const resumeError = document.getElementById('resumeError');
    if(!resumeFile.files || resumeFile.files.length === 0){
      resumeError.classList.add('show');
      dropzone.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    resumeError.classList.remove('show');
    showToast('Profile saved successfully.');
    goStep(5);
  }
