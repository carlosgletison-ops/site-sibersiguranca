document.addEventListener("DOMContentLoaded", () => {
  // 1. INTERACTIVE PRELOADER (LOADING ANIMATION)
  const preloader = document.getElementById("preloader");
  const percentText = document.getElementById("loader-percent");
  const barFill = document.getElementById("loader-fill");
  
  let count = 0;
  const speed = 20; // 20ms intervals (approx 2s total loading time)
  
  const loadingInterval = setInterval(() => {
    count++;
    if (percentText) percentText.textContent = `${count}%`;
    if (barFill) barFill.style.width = `${count}%`;
    
    if (count >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add("loaded");
          // Trigger animations in hero section after loader hides
          document.body.style.overflowY = "auto";
          triggerStatsAnimation();
        }
      }, 500);
    }
  }, speed);

  // Disable vertical scroll during loading
  document.body.style.overflowY = "hidden";


  // 2. HEADER SCROLL EFFECT
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


  // 3. MOBILE HAMBURGER MENU
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Animate hamburger lines to X
      const spans = menuToggle.querySelectorAll("span");
      if (navLinks.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(6px, 6px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(6px, -7px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close menu when clicking links
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const spans = menuToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      });
    });
  }


  // 4. HERO CARD 3D TILT EFFECT
  const heroCard = document.getElementById("hero-card");
  if (heroCard) {
    heroCard.addEventListener("mousemove", (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate angles based on mouse position relative to card center
      const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
      const rotateY = ((x - centerX) / centerX) * 12;
      
      heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }


  // 5. STATS ANIMATION TRIGGER
  let statsAnimated = false;
  
  function triggerStatsAnimation() {
    const statsSection = document.getElementById("stats-section");
    if (!statsSection || statsAnimated) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateStats();
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(statsSection);
  }
  
  function animateStats() {
    const statNums = document.querySelectorAll(".stat-num");
    statNums.forEach(stat => {
      const target = parseInt(stat.getAttribute("data-target"), 10);
      const suffix = stat.getAttribute("data-suffix") || "";
      let current = 0;
      const duration = 1500; // 1.5 seconds animation
      const increment = target / (duration / 16); // ~60fps
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = `${target}${suffix}`;
          clearInterval(counter);
        } else {
          stat.textContent = `${Math.floor(current)}${suffix}`;
        }
      }, 16);
    });
  }


  // 6. INTERACTIVE FOOD SAFETY DIAGNOSTIC COMPLIANCE QUIZ
  const steps = document.querySelectorAll(".quiz-step");
  const options = document.querySelectorAll(".quiz-option-card");
  const backBtn = document.getElementById("quiz-back-btn");
  const nextBtn = document.getElementById("quiz-next-btn");
  const progressFill = document.getElementById("quiz-progress-fill");
  const resultsDiv = document.getElementById("quiz-results");
  const resultsPercent = document.getElementById("results-percent");
  const resultsGauge = document.getElementById("results-gauge");
  const resultsTitle = document.getElementById("results-title");
  const resultsDesc = document.getElementById("results-desc");
  const resultsPill = document.getElementById("results-pill");
  
  let currentStep = 0;
  const answers = {};
  
  // Option Card selection logic
  options.forEach(card => {
    card.addEventListener("click", () => {
      const questionId = card.getAttribute("data-question");
      const answerValue = card.getAttribute("data-value");
      
      // Select the hidden radio button
      const radio = card.querySelector("input[type='radio']");
      if (radio) radio.checked = true;
      
      // Remove selected class from sibling option cards in the same question step
      const stepOptions = card.closest(".quiz-options").querySelectorAll(".quiz-option-card");
      stepOptions.forEach(opt => opt.classList.remove("selected"));
      
      // Add selected class to current card
      card.classList.add("selected");
      
      // Save answer
      answers[questionId] = answerValue;
      
      // Enable NEXT button
      if (nextBtn) nextBtn.removeAttribute("disabled");
      
      // Auto-advance after a small delay (300ms) for smoother UX
      setTimeout(() => {
        advanceStep();
      }, 350);
    });
  });
  
  // Quiz navigation back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
        updateQuizUI();
      }
    });
  }
  
  // Quiz navigation next button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      advanceStep();
    });
  }
  
  function advanceStep() {
    const currentQuestion = steps[currentStep].getAttribute("data-step-id");
    // Ensure an answer is selected
    if (!answers[currentQuestion]) return;
    
    steps[currentStep].classList.remove("active");
    
    if (currentStep < steps.length - 1) {
      currentStep++;
      steps[currentStep].classList.add("active");
      updateQuizUI();
    } else {
      // Show results
      showQuizResults();
    }
  }
  
  function updateQuizUI() {
    // Show/hide back button
    if (backBtn) {
      if (currentStep === 0) {
        backBtn.style.visibility = "hidden";
      } else {
        backBtn.style.visibility = "visible";
      }
    }
    
    // Check if the current step already has a selected answer to enable/disable next button
    const currentQuestion = steps[currentStep].getAttribute("data-step-id");
    if (nextBtn) {
      if (answers[currentQuestion]) {
        nextBtn.removeAttribute("disabled");
      } else {
        nextBtn.setAttribute("disabled", "true");
      }
      
      // If last step, change Next button text to Finish
      if (currentStep === steps.length - 1) {
        nextBtn.textContent = "Ver Resultado";
      } else {
        nextBtn.textContent = "Próximo";
      }
    }
    
    // Update progress bar fill
    const progressPercent = (currentStep / steps.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
  }
  
  function showQuizResults() {
    if (nextBtn) nextBtn.style.display = "none";
    if (backBtn) backBtn.style.display = "none";
    if (progressFill) progressFill.style.width = "100%";
    
    // Count "SIM" answers (representing compliant practices)
    let compliantCount = 0;
    const totalQuestions = steps.length;
    for (const q in answers) {
      if (answers[q] === "sim") compliantCount++;
    }
    
    // Score out of 100
    const complianceScore = Math.round((compliantCount / totalQuestions) * 100);
    
    // Show results section
    if (resultsDiv) resultsDiv.classList.add("active");
    
    // Animate percentage text
    let displayScore = 0;
    const scoreInterval = setInterval(() => {
      if (displayScore >= complianceScore) {
        if (resultsPercent) resultsPercent.textContent = `${complianceScore}%`;
        clearInterval(scoreInterval);
      } else {
        displayScore += 2;
        if (resultsPercent) resultsPercent.textContent = `${displayScore}%`;
      }
    }, 15);
    
    // Rotate Gauge Hand/Fill
    // Gauge ranges from -135deg (0%) to +45deg (100%)
    // Diff is 180 degrees total rotation.
    const rotationDeg = -135 + (complianceScore / 100) * 180;
    if (resultsGauge) {
      resultsGauge.style.transform = `rotate(${rotationDeg}deg)`;
    }
    
    // Adjust visual risk levels based on compliance score
    if (complianceScore === 100) {
      setRiskUI("risk-low", "Baixo Risco", "#58D6A8", "Excelente! Seu negócio está em plena conformidade com as principais exigências da ANVISA. Mantenha os padrões com auditorias preventivas periódicas.");
    } else if (complianceScore === 75) {
      setRiskUI("risk-medium", "Médio-Baixo Risco", "#F2BA31", "Bom trabalho! O estabelecimento atende à maioria das normas, mas existem alguns pequenos pontos de atenção na documentação ou processos que necessitam de ajustes para evitar multas.");
    } else if (complianceScore === 50) {
      setRiskUI("risk-medium", "Médio Risco", "#F2BA31", "Atenção! Você atende a metade dos requisitos básicos de higiene e conformidade sanitária. Recomendamos uma consultoria corretiva rápida para evitar autuações da Vigilância Sanitária.");
    } else if (complianceScore === 25) {
      setRiskUI("risk-high", "Alto Risco", "#F27910", "Alerta! Seu estabelecimento está vulnerável a multas pesadas ou interdições sanitárias devido a falhas graves em processos operacionais e treinamento de manipuladores.");
    } else {
      setRiskUI("risk-high", "Risco Crítico", "#F27910", "Perigo Imediato! O estabelecimento falha em todos os controles essenciais de segurança de alimentos. É urgente implantar medidas corretivas imediatas e treinar sua equipe.");
    }
  }
  
  function setRiskUI(pillClass, pillText, colorHex, descText) {
    if (resultsPill) {
      resultsPill.className = `results-risk-pill ${pillClass}`;
      resultsPill.textContent = pillText;
    }
    if (resultsGauge) {
      resultsGauge.style.borderColor = colorHex;
      // Keep gauge transparent top/left for semantic circle rendering
      resultsGauge.style.borderTopColor = "transparent";
      resultsGauge.style.borderLeftColor = "transparent";
    }
    if (resultsPercent) {
      resultsPercent.style.color = colorHex;
    }
    if (resultsTitle) {
      resultsTitle.textContent = `Nível de Conformidade Sanitária`;
    }
    if (resultsDesc) {
      resultsDesc.textContent = descText;
    }
  }
  
  // Initialize Quiz buttons visibility
  updateQuizUI();


  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = "Enviando...";
      submitBtn.setAttribute("disabled", "true");
      
      setTimeout(() => {
        submitBtn.textContent = "Mensagem Enviada!";
        submitBtn.style.backgroundColor = "#58D6A8";
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = "";
          submitBtn.removeAttribute("disabled");
        }, 3000);
      }, 1500);
    });
  }

});
