function SettingsPage(root, params) {
  this.root = root;
}

$.extend(SettingsPage.prototype, Page.prototype);

SettingsPage.prototype.display = function() {
  this.root.html(_settingsTemplate.render({
    name: data.user.name,
    email: data.user.email,
    allow_email: data.user.allowEmail,
    primaryInterests: $.grep(data.user.interests,
        function (x) { return x.primary; }),
    secondaryInterests: $.grep(data.user.interests,
        function (x) { return !x.primary; })
  }));

  LogEvent('client/settings');
};

SettingsPage.prototype.attach = function() {
  var that = this;
  $('#inputName').bind('blur', function (evt) {
    data.setName(evt.target.value);
  });
  $('#inputAllowEmail').bind('change', function (evt) {
    data.setAllowEmail(evt.target.checked);
  });
  $('A.add-primary').bind('click', function (evt) {
    evt.preventDefault();
    data.addInterest($(evt.target).data('cat'), true,
        function () { that.redisplay() });
  });
  $('A.add-secondary').bind('click', function (evt) {
    evt.preventDefault();
    data.addInterest($(evt.target).data('cat'), false,
        function () { that.redisplay() });
  });
  $('BUTTON.remove-primary').bind('click', function (evt) {
    evt.preventDefault();
    data.removeInterest($(evt.target).data('cat'),
        function () { that.redisplay() });
  });
  $('BUTTON.remove-secondary').bind('click', function (evt) {
    evt.preventDefault();
    data.removeInterest($(evt.target).data('cat'),
        function () { that.redisplay() });
  });
  $('#done').bind('click', function (evt) {
    location.hash = '#';  // go to the home page
  });
};

SettingsPage.prototype.detach = function() {
  $('#inputName').unbind('blur');
  $('#inputAllowEmail').unbind('change');
  $('A.add-primary').unbind('click');
  $('A.add-secondary').unbind('click');
  $('BUTTON.remove-primary').unbind('click');
  $('BUTTON.remove-secondary').unbind('click');
  $('#done').unbind('click');
};

// TODO: move these to new files.
var _settingsTemplate = $.templates(
    '<h1>Settings</h1>' +
    '<form class="form-horizontal">' +
      '<h2>Profile</h2>' +
      '<div class="control-group" style="margin-top: 20px;">' +
        '<label class="control-label" for="inputName">Name</label>' +
        '<div class="controls">' +
          '<input type="text" class="input-large" id="inputName"' +
                ' value="{{>name}}">' +
        '</div>' +
      '</div>' +
      '<div class="control-group">' +
        '<label class="control-label" for="inputEmail">Email</label>' +
        '<div class="controls">' +
          '<span class="input-large uneditable-input" id="inputEmail">' +
            '{{>email}}' +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="control-group">' +
        '<div class="controls">' +
          '<label class="checkbox" for="inputAllowEmail">' +
            '<input type="checkbox" id="inputAllowEmail"' +
                  ' {{> allow_email ? \'checked="checked"\' : \'\'}}"> ' +
	    'Email me about important changes to this site or my account ' +
            '(and nothing else).' +
          '</label>' +
      '</div>' +
      '</div>' +
      '<h2>Interests</h2>' +
      '<h3>Primary</h3>' +
      '<span class="help-block">These are categories that try to stay ' +
      'up-to-date with. You read these ideally every day, but at least once ' +
      'a week.</span>' +
      '{{for primaryInterests}}' +
      '<div class="control-group"' +
          ' {{if #index == 0}}style="margin-top: 20px;"{{/if}}>' +
        '<div class="controls">' +
            '<input type="text" value="{{>category}}"' +
                  ' class="input-medium uneditable-input">' +
            '<button class="btn remove-primary" data-cat="{{>category}}"' +
                   ' style="margin-left: 10px;">' +
              'Remove' +
            '</button>' +
        '</div>' +
      '</div>' +
      '{{/for}}' +
      // TODO: use submenus once bootstrap-sass has been upgraded
      '<div class="control-group"' +
          '{{if primaryInterests.length == 0}}' +
          ' style="margin-top: 20px;"' +
          '{{/if}}>' +
        '<div class="controls">' +
          '<div class="btn-group">' +
            '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' +
              'Add ' +
              '<span class="caret"></span>' +
            '</a>' +
            '<ul class="dropdown-menu">' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.CO">' +
                'astro-ph.CO &mdash; Astrophysics - Cosmology and Extragalactic Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.EP">' +
                'astro-ph.EP &mdash; Astrophysics - Earth and Planetary Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.GA">' +
                'astro-ph.GA &mdash; Astrophysics - Galaxy Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.HE">' +
                'astro-ph.HE &mdash; Astrophysics - High Energy Astrophysical Phenomena' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.IM">' +
                'astro-ph.IM &mdash; Astrophysics - Instrumentation and Methods for Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="astro-ph.SR">' +
                'astro-ph.SR &mdash; Astrophysics - Solar and Stellar Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.dis-nn">' +
                'cond-mat.dis-nn &mdash; Condensed Matter - Disordered Systems and Neural Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.mtrl-sci">' +
                'cond-mat.mtrl-sci &mdash; Condensed Matter - Materials Science' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.mes-hall">' +
                'cond-mat.mes-hall &mdash; Physics - Mesoscopic Systems and Quantum Hall Effect' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.other">' +
                'cond-mat.other &mdash; Condensed Matter - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.quant-gas">' +
                'cond-mat.quant-gas &mdash; Condensed Matter - Quantum Gases' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.soft">' +
                'cond-mat.soft &mdash; Condensed Matter - Soft Condensed Matter' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.stat-mech">' +
                'cond-mat.stat-mech &mdash; Condensed Matter - Statistical Mechanics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.str-el">' +
                'cond-mat.str-el &mdash; Condensed Matter - Strongly Correlated Electrons' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cond-mat.supr-con">' +
                'cond-mat.supr-con &mdash; Condensed Matter - Superconductivity' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="gr-qc">' +
                'gr-qc &mdash; General Relativity and Quantum Cosmology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="hep-ex">' +
                'hep-ex &mdash; High Energy Physics - Experiment' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="hep-lat">' +
                'hep-lat &mdash; High Energy Physics - Lattice' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="hep-ph">' +
                'hep-ph &mdash; High Energy Physics - Phenomenology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="hep-th">' +
                'hep-th &mdash; High Energy Physics - Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math-ph">' +
                'math-ph &mdash; Mathematical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nucl-ex">' +
                'nucl-ex &mdash; Nuclear Experiment' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nucl-th">' +
                'nucl-th &mdash; Nuclear Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.acc-ph">' +
                'physics.acc-ph &mdash; Physics - Accelerator Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.ao-ph">' +
                'physics.ao-ph &mdash; Physics - Atmospheric and Oceanic Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.atom-ph">' +
                'physics.atom-ph &mdash; Physics - Atomic Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.atm-clus">' +
                'physics.atm-clus &mdash; Physics - Atomic and Molecular Clusters' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.bio-ph">' +
                'physics.bio-ph &mdash; Physics - Biological Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.chem-ph">' +
                'physics.chem-ph &mdash; Physics - Chemical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.class-ph">' +
                'physics.class-ph &mdash; Physics - Clasical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.comp-ph">' +
                'physics.comp-ph &mdash; Physics - Computational Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.data-an">' +
                'physics.data-an &mdash; Physics - Data Analysis; Statistics and Probability' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.flu-dyn">' +
                'physics.flu-dyn &mdash; Physics - Fluid Dynamics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.gen-ph">' +
                'physics.gen-ph &mdash; Physics - General Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.geo-ph">' +
                'physics.geo-ph &mdash; Physics - Geophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.hist-ph">' +
                'physics.hist-ph &mdash; Physics - History of Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.ins-det">' +
                'physics.ins-det &mdash; Physics - Instrumentation and Detectors' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.med-ph">' +
                'physics.med-ph &mdash; Physics - Medical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.optics">' +
                'physics.optics &mdash; Physics - Optics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.ed-ph">' +
                'physics.ed-ph &mdash; Physics - Physics Education' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.soc-ph">' +
                'physics.soc-ph &mdash; Physics - Physics and Society' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.plasm-ph">' +
                'physics.plasm-ph &mdash; Physics - Plasma Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.pop-ph">' +
                'physics.pop-ph &mdash; Physics - Popular Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="physics.space-ph">' +
                'physics.space-ph &mdash; Physics - Space Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="quant-ph">' +
                'quant-ph &mdash; Quantum Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.AG">' +
                'math.AG &mdash; Mathematics - Algebraic Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.AT">' +
                'math.AT &mdash; Mathematics - Algebraic Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.AP">' +
                'math.AP &mdash; Mathematics - Analysis of PDEs' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.CT">' +
                'math.CT &mdash; Mathematics - Category Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.CA">' +
                'math.CA &mdash; Mathematics - Classical Analysis and ODEs' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.CO">' +
                'math.CO &mdash; Mathematics - Combinatorics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.AC">' +
                'math.AC &mdash; Mathematics - Commutative Algebra' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.CV">' +
                'math.CV &mdash; Mathematics - Complex Variables' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.DG">' +
                'math.DG &mdash; Mathematics - Differential Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.DS">' +
                'math.DS &mdash; Mathematics - Dynamical Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.FA">' +
                'math.FA &mdash; Mathematics - Functional Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.GM">' +
                'math.GM &mdash; Mathematics - General Mathematics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.GN">' +
                'math.GN &mdash; Mathematics - General Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.GT">' +
                'math.GT &mdash; Mathematics - Geometric Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.GR">' +
                'math.GR &mdash; Mathematics - Group Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.HO">' +
                'math.HO &mdash; Mathematics - History and Overview' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.IT">' +
                'math.IT &mdash; Mathematics - Information Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.KT">' +
                'math.KT &mdash; Mathematics - K-Theory and Homology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.LO">' +
                'math.LO &mdash; Mathematics - Logic' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.MP">' +
                'math.MP &mdash; Mathematics - Mathematical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.MG">' +
                'math.MG &mdash; Mathematics - Metric Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.NT">' +
                'math.NT &mdash; Mathematics - Number Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.NA">' +
                'math.NA &mdash; Mathematics - Numerical Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.OA">' +
                'math.OA &mdash; Mathematics - Operator Algebras' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.OC">' +
                'math.OC &mdash; Mathematics - Optimization and Control' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.PR">' +
                'math.PR &mdash; Mathematics - Probability' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.QA">' +
                'math.QA &mdash; Mathematics - Quantum Algebra' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.RT">' +
                'math.RT &mdash; Mathematics - Representation Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.RA">' +
                'math.RA &mdash; Mathematics - Rings and Algebras' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.SP">' +
                'math.SP &mdash; Mathematics - Spectral Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.ST">' +
                'math.ST &mdash; Mathematics - Statistics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="math.SG">' +
                'math.SG &mdash; Mathematics - Symplectic Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nlin.AO">' +
                'nlin.AO &mdash; Nonlinear Sciences - Adaptation and Self-Organizing Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nlin.CG">' +
                'nlin.CG &mdash; Nonlinear Sciences - Cellular Automata and Lattice Gases' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nlin.CD">' +
                'nlin.CD &mdash; Nonlinear Sciences - Chaotic Dynamics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nlin.SI">' +
                'nlin.SI &mdash; Nonlinear Sciences - Exactly Solvable and Integrable Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="nlin.PS">' +
                'nlin.PS &mdash; Nonlinear Sciences - Pattern Formation and Solitons' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.AI">' +
                'cs.AI &mdash; Computer Science - Artificial Intelligence' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CL">' +
                'cs.CL &mdash; Computer Science - Computation and Language' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CC">' +
                'cs.CC &mdash; Computer Science - Computational Complexity' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CE">' +
                'cs.CE &mdash; Computer Science - Computational Engineering; Finance; and Science' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CG">' +
                'cs.CG &mdash; Computer Science - Computational Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.GT">' +
                'cs.GT &mdash; Computer Science - Computer Science and Game Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CV">' +
                'cs.CV &mdash; Computer Science - Computer Vision and Pattern Recognition' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CY">' +
                'cs.CY &mdash; Computer Science - Computers and Society' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.CR">' +
                'cs.CR &mdash; Computer Science - Cryptography and Security' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.DS">' +
                'cs.DS &mdash; Computer Science - Data Structures and Algorithms' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.DB">' +
                'cs.DB &mdash; Computer Science - Databases' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.DL">' +
                'cs.DL &mdash; Computer Science - Digital Libraries' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.DM">' +
                'cs.DM &mdash; Computer Science - Discrete Mathematics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.DC">' +
                'cs.DC &mdash; Computer Science - Distributed; Parallel; and Cluster Computing' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.ET">' +
                'cs.ET &mdash; Computer Science - Emerging Technologies' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.FL">' +
                'cs.FL &mdash; Computer Science - Formal Languages and Automata Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.GL">' +
                'cs.GL &mdash; Computer Science - General Literature' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.GR">' +
                'cs.GR &mdash; Computer Science - Graphics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.AR">' +
                'cs.AR &mdash; Computer Science - Hardware Architecture' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.HC">' +
                'cs.HC &mdash; Computer Science - Human-Computer Interaction' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.IR">' +
                'cs.IR &mdash; Computer Science - Information Retrieval' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.IT">' +
                'cs.IT &mdash; Computer Science - Information Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.LG">' +
                'cs.LG &mdash; Computer Science - Learning' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.LO">' +
                'cs.LO &mdash; Computer Science - Logic in Computer Science' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.MS">' +
                'cs.MS &mdash; Computer Science - Mathematical Software' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.MA">' +
                'cs.MA &mdash; Computer Science - Multiagent Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.MM">' +
                'cs.MM &mdash; Computer Science - Multimedia' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.NI">' +
                'cs.NI &mdash; Computer Science - Networking and Internet Architecture' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.NE">' +
                'cs.NE &mdash; Computer Science - Neural and Evolutionary Computing' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.NA">' +
                'cs.NA &mdash; Computer Science - Numerical Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.OS">' +
                'cs.OS &mdash; Computer Science - Operating Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.OH">' +
                'cs.OH &mdash; Computer Science - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.PF">' +
                'cs.PF &mdash; Computer Science - Performance' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.PL">' +
                'cs.PL &mdash; Computer Science - Programming Languages' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.RO">' +
                'cs.RO &mdash; Computer Science - Robotics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.SI">' +
                'cs.SI &mdash; Computer Science - Social and Information Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.SE">' +
                'cs.SE &mdash; Computer Science - Software Engineering' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.SD">' +
                'cs.SD &mdash; Computer Science - Sound' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.SC">' +
                'cs.SC &mdash; Computer Science - Symbolic Computation' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="cs.SY">' +
                'cs.SY &mdash; Computer Science - Systems and Control' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.BM">' +
                'q-bio.BM &mdash; Quantitative Biology - Biomolecules' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.CB">' +
                'q-bio.CB &mdash; Quantitative Biology - Cell Behavior' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.GN">' +
                'q-bio.GN &mdash; Quantitative Biology - Genomics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.MN">' +
                'q-bio.MN &mdash; Quantitative Biology - Molecular Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.NC">' +
                'q-bio.NC &mdash; Quantitative Biology - Neurons and Cognition' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.OT">' +
                'q-bio.OT &mdash; Quantitative Biology - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.PE">' +
                'q-bio.PE &mdash; Quantitative Biology - Populations and Evolution' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.QM">' +
                'q-bio.QM &mdash; Quantitative Biology - Quantitative Methods' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.SC">' +
                'q-bio.SC &mdash; Quantitative Biology - Subcellular Processes' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-bio.TO">' +
                'q-bio.TO &mdash; Quantitative Biology - Tissues and Organs' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.CP">' +
                'q-fin.CP &mdash; Quantitative Finance - Computational Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.GN">' +
                'q-fin.GN &mdash; Quantitative Finance - General Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.PM">' +
                'q-fin.PM &mdash; Quantitative Finance - Portfolio Management' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.PR">' +
                'q-fin.PR &mdash; Quantitative Finance - Pricing of Securities' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.RM">' +
                'q-fin.RM &mdash; Quantitative Finance - Risk Management' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.ST">' +
                'q-fin.ST &mdash; Quantitative Finance - Statistical Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="q-fin.TR">' +
                'q-fin.TR &mdash; Quantitative Finance - Trading and Market Microstructure' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.AP">' +
                'stat.AP &mdash; Statistics - Applications' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.CO">' +
                'stat.CO &mdash; Statistics - Computation' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.ML">' +
                'stat.ML &mdash; Statistics - Machine Learning' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.ME">' +
                'stat.ME &mdash; Statistics - Methodology' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.OT">' +
                'stat.OT &mdash; Statistics - Other Statistics' +
              '</a></li>' +
              '<li><a href="#" class="add-primary" data-cat="stat.TH">' +
                'stat.TH &mdash; Statistics - Theory' +
              '</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<h3>Secondary</h3>' +
      '<span class="help-block">These are categories that you have some ' +
      'interest in, but you do not try to look at every article.</span>' +
      '{{for secondaryInterests}}' +
      '<div class="control-group"' +
          ' {{if #index == 0}}style="margin-top: 20px;"{{/if}}>' +
        '<div class="controls">' +
            '<input type="text" value="{{>category}}"' +
                  ' class="input-medium uneditable-input">' +
            '<button class="btn remove-secondary" data-cat="{{>category}}"' +
                   ' style="margin-left: 10px;">' +
              'Remove' +
            '</button>' +
        '</div>' +
      '</div>' +
      '{{/for}}' +
      // TODO: use submenus once bootstrap-sass has been upgraded
      '<div class="control-group"' +
          '{{if secondaryInterests.length == 0}}' +
          ' style="margin-top: 20px;"' +
          '{{/if}}>' +
        '<div class="controls">' +
          '<div class="btn-group">' +
            '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">' +
              'Add ' +
              '<span class="caret"></span>' +
            '</a>' +
            '<ul class="dropdown-menu">' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.CO">' +
                'astro-ph.CO &mdash; Astrophysics - Cosmology and Extragalactic Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.EP">' +
                'astro-ph.EP &mdash; Astrophysics - Earth and Planetary Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.GA">' +
                'astro-ph.GA &mdash; Astrophysics - Galaxy Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.HE">' +
                'astro-ph.HE &mdash; Astrophysics - High Energy Astrophysical Phenomena' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.IM">' +
                'astro-ph.IM &mdash; Astrophysics - Instrumentation and Methods for Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="astro-ph.SR">' +
                'astro-ph.SR &mdash; Astrophysics - Solar and Stellar Astrophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.dis-nn">' +
                'cond-mat.dis-nn &mdash; Condensed Matter - Disordered Systems and Neural Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.mtrl-sci">' +
                'cond-mat.mtrl-sci &mdash; Condensed Matter - Materials Science' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.mes-hall">' +
                'cond-mat.mes-hall &mdash; Physics - Mesoscopic Systems and Quantum Hall Effect' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.other">' +
                'cond-mat.other &mdash; Condensed Matter - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.quant-gas">' +
                'cond-mat.quant-gas &mdash; Condensed Matter - Quantum Gases' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.soft">' +
                'cond-mat.soft &mdash; Condensed Matter - Soft Condensed Matter' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.stat-mech">' +
                'cond-mat.stat-mech &mdash; Condensed Matter - Statistical Mechanics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.str-el">' +
                'cond-mat.str-el &mdash; Condensed Matter - Strongly Correlated Electrons' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cond-mat.supr-con">' +
                'cond-mat.supr-con &mdash; Condensed Matter - Superconductivity' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="gr-qc">' +
                'gr-qc &mdash; General Relativity and Quantum Cosmology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="hep-ex">' +
                'hep-ex &mdash; High Energy Physics - Experiment' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="hep-lat">' +
                'hep-lat &mdash; High Energy Physics - Lattice' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="hep-ph">' +
                'hep-ph &mdash; High Energy Physics - Phenomenology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="hep-th">' +
                'hep-th &mdash; High Energy Physics - Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math-ph">' +
                'math-ph &mdash; Mathematical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nucl-ex">' +
                'nucl-ex &mdash; Nuclear Experiment' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nucl-th">' +
                'nucl-th &mdash; Nuclear Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.acc-ph">' +
                'physics.acc-ph &mdash; Physics - Accelerator Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.ao-ph">' +
                'physics.ao-ph &mdash; Physics - Atmospheric and Oceanic Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.atom-ph">' +
                'physics.atom-ph &mdash; Physics - Atomic Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.atm-clus">' +
                'physics.atm-clus &mdash; Physics - Atomic and Molecular Clusters' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.bio-ph">' +
                'physics.bio-ph &mdash; Physics - Biological Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.chem-ph">' +
                'physics.chem-ph &mdash; Physics - Chemical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.class-ph">' +
                'physics.class-ph &mdash; Physics - Clasical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.comp-ph">' +
                'physics.comp-ph &mdash; Physics - Computational Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.data-an">' +
                'physics.data-an &mdash; Physics - Data Analysis; Statistics and Probability' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.flu-dyn">' +
                'physics.flu-dyn &mdash; Physics - Fluid Dynamics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.gen-ph">' +
                'physics.gen-ph &mdash; Physics - General Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.geo-ph">' +
                'physics.geo-ph &mdash; Physics - Geophysics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.hist-ph">' +
                'physics.hist-ph &mdash; Physics - History of Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.ins-det">' +
                'physics.ins-det &mdash; Physics - Instrumentation and Detectors' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.med-ph">' +
                'physics.med-ph &mdash; Physics - Medical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.optics">' +
                'physics.optics &mdash; Physics - Optics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.ed-ph">' +
                'physics.ed-ph &mdash; Physics - Physics Education' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.soc-ph">' +
                'physics.soc-ph &mdash; Physics - Physics and Society' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.plasm-ph">' +
                'physics.plasm-ph &mdash; Physics - Plasma Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.pop-ph">' +
                'physics.pop-ph &mdash; Physics - Popular Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="physics.space-ph">' +
                'physics.space-ph &mdash; Physics - Space Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="quant-ph">' +
                'quant-ph &mdash; Quantum Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.AG">' +
                'math.AG &mdash; Mathematics - Algebraic Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.AT">' +
                'math.AT &mdash; Mathematics - Algebraic Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.AP">' +
                'math.AP &mdash; Mathematics - Analysis of PDEs' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.CT">' +
                'math.CT &mdash; Mathematics - Category Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.CA">' +
                'math.CA &mdash; Mathematics - Classical Analysis and ODEs' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.CO">' +
                'math.CO &mdash; Mathematics - Combinatorics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.AC">' +
                'math.AC &mdash; Mathematics - Commutative Algebra' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.CV">' +
                'math.CV &mdash; Mathematics - Complex Variables' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.DG">' +
                'math.DG &mdash; Mathematics - Differential Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.DS">' +
                'math.DS &mdash; Mathematics - Dynamical Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.FA">' +
                'math.FA &mdash; Mathematics - Functional Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.GM">' +
                'math.GM &mdash; Mathematics - General Mathematics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.GN">' +
                'math.GN &mdash; Mathematics - General Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.GT">' +
                'math.GT &mdash; Mathematics - Geometric Topology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.GR">' +
                'math.GR &mdash; Mathematics - Group Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.HO">' +
                'math.HO &mdash; Mathematics - History and Overview' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.IT">' +
                'math.IT &mdash; Mathematics - Information Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.KT">' +
                'math.KT &mdash; Mathematics - K-Theory and Homology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.LO">' +
                'math.LO &mdash; Mathematics - Logic' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.MP">' +
                'math.MP &mdash; Mathematics - Mathematical Physics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.MG">' +
                'math.MG &mdash; Mathematics - Metric Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.NT">' +
                'math.NT &mdash; Mathematics - Number Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.NA">' +
                'math.NA &mdash; Mathematics - Numerical Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.OA">' +
                'math.OA &mdash; Mathematics - Operator Algebras' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.OC">' +
                'math.OC &mdash; Mathematics - Optimization and Control' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.PR">' +
                'math.PR &mdash; Mathematics - Probability' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.QA">' +
                'math.QA &mdash; Mathematics - Quantum Algebra' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.RT">' +
                'math.RT &mdash; Mathematics - Representation Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.RA">' +
                'math.RA &mdash; Mathematics - Rings and Algebras' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.SP">' +
                'math.SP &mdash; Mathematics - Spectral Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.ST">' +
                'math.ST &mdash; Mathematics - Statistics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="math.SG">' +
                'math.SG &mdash; Mathematics - Symplectic Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nlin.AO">' +
                'nlin.AO &mdash; Nonlinear Sciences - Adaptation and Self-Organizing Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nlin.CG">' +
                'nlin.CG &mdash; Nonlinear Sciences - Cellular Automata and Lattice Gases' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nlin.CD">' +
                'nlin.CD &mdash; Nonlinear Sciences - Chaotic Dynamics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nlin.SI">' +
                'nlin.SI &mdash; Nonlinear Sciences - Exactly Solvable and Integrable Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="nlin.PS">' +
                'nlin.PS &mdash; Nonlinear Sciences - Pattern Formation and Solitons' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.AI">' +
                'cs.AI &mdash; Computer Science - Artificial Intelligence' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CL">' +
                'cs.CL &mdash; Computer Science - Computation and Language' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CC">' +
                'cs.CC &mdash; Computer Science - Computational Complexity' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CE">' +
                'cs.CE &mdash; Computer Science - Computational Engineering; Finance; and Science' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CG">' +
                'cs.CG &mdash; Computer Science - Computational Geometry' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.GT">' +
                'cs.GT &mdash; Computer Science - Computer Science and Game Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CV">' +
                'cs.CV &mdash; Computer Science - Computer Vision and Pattern Recognition' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CY">' +
                'cs.CY &mdash; Computer Science - Computers and Society' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.CR">' +
                'cs.CR &mdash; Computer Science - Cryptography and Security' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.DS">' +
                'cs.DS &mdash; Computer Science - Data Structures and Algorithms' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.DB">' +
                'cs.DB &mdash; Computer Science - Databases' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.DL">' +
                'cs.DL &mdash; Computer Science - Digital Libraries' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.DM">' +
                'cs.DM &mdash; Computer Science - Discrete Mathematics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.DC">' +
                'cs.DC &mdash; Computer Science - Distributed; Parallel; and Cluster Computing' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.ET">' +
                'cs.ET &mdash; Computer Science - Emerging Technologies' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.FL">' +
                'cs.FL &mdash; Computer Science - Formal Languages and Automata Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.GL">' +
                'cs.GL &mdash; Computer Science - General Literature' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.GR">' +
                'cs.GR &mdash; Computer Science - Graphics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.AR">' +
                'cs.AR &mdash; Computer Science - Hardware Architecture' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.HC">' +
                'cs.HC &mdash; Computer Science - Human-Computer Interaction' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.IR">' +
                'cs.IR &mdash; Computer Science - Information Retrieval' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.IT">' +
                'cs.IT &mdash; Computer Science - Information Theory' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.LG">' +
                'cs.LG &mdash; Computer Science - Learning' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.LO">' +
                'cs.LO &mdash; Computer Science - Logic in Computer Science' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.MS">' +
                'cs.MS &mdash; Computer Science - Mathematical Software' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.MA">' +
                'cs.MA &mdash; Computer Science - Multiagent Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.MM">' +
                'cs.MM &mdash; Computer Science - Multimedia' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.NI">' +
                'cs.NI &mdash; Computer Science - Networking and Internet Architecture' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.NE">' +
                'cs.NE &mdash; Computer Science - Neural and Evolutionary Computing' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.NA">' +
                'cs.NA &mdash; Computer Science - Numerical Analysis' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.OS">' +
                'cs.OS &mdash; Computer Science - Operating Systems' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.OH">' +
                'cs.OH &mdash; Computer Science - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.PF">' +
                'cs.PF &mdash; Computer Science - Performance' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.PL">' +
                'cs.PL &mdash; Computer Science - Programming Languages' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.RO">' +
                'cs.RO &mdash; Computer Science - Robotics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.SI">' +
                'cs.SI &mdash; Computer Science - Social and Information Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.SE">' +
                'cs.SE &mdash; Computer Science - Software Engineering' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.SD">' +
                'cs.SD &mdash; Computer Science - Sound' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.SC">' +
                'cs.SC &mdash; Computer Science - Symbolic Computation' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="cs.SY">' +
                'cs.SY &mdash; Computer Science - Systems and Control' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.BM">' +
                'q-bio.BM &mdash; Quantitative Biology - Biomolecules' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.CB">' +
                'q-bio.CB &mdash; Quantitative Biology - Cell Behavior' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.GN">' +
                'q-bio.GN &mdash; Quantitative Biology - Genomics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.MN">' +
                'q-bio.MN &mdash; Quantitative Biology - Molecular Networks' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.NC">' +
                'q-bio.NC &mdash; Quantitative Biology - Neurons and Cognition' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.OT">' +
                'q-bio.OT &mdash; Quantitative Biology - Other' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.PE">' +
                'q-bio.PE &mdash; Quantitative Biology - Populations and Evolution' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.QM">' +
                'q-bio.QM &mdash; Quantitative Biology - Quantitative Methods' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.SC">' +
                'q-bio.SC &mdash; Quantitative Biology - Subcellular Processes' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-bio.TO">' +
                'q-bio.TO &mdash; Quantitative Biology - Tissues and Organs' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.CP">' +
                'q-fin.CP &mdash; Quantitative Finance - Computational Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.GN">' +
                'q-fin.GN &mdash; Quantitative Finance - General Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.PM">' +
                'q-fin.PM &mdash; Quantitative Finance - Portfolio Management' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.PR">' +
                'q-fin.PR &mdash; Quantitative Finance - Pricing of Securities' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.RM">' +
                'q-fin.RM &mdash; Quantitative Finance - Risk Management' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.ST">' +
                'q-fin.ST &mdash; Quantitative Finance - Statistical Finance' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="q-fin.TR">' +
                'q-fin.TR &mdash; Quantitative Finance - Trading and Market Microstructure' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.AP">' +
                'stat.AP &mdash; Statistics - Applications' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.CO">' +
                'stat.CO &mdash; Statistics - Computation' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.ML">' +
                'stat.ML &mdash; Statistics - Machine Learning' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.ME">' +
                'stat.ME &mdash; Statistics - Methodology' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.OT">' +
                'stat.OT &mdash; Statistics - Other Statistics' +
              '</a></li>' +
              '<li><a href="#" class="add-secondary" data-cat="stat.TH">' +
                'stat.TH &mdash; Statistics - Theory' +
              '</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="btn" class="btn btn-primary" id="done">' +
        'Done' +
      '</button>' +
    '</form>');