// Compatibility for buttons on older cached portfolio pages.
document.addEventListener("click",event=>{if(!(event.target instanceof Element))return;const button=event.target.closest("#download-cv,.download-cv-btn");if(!button)return;button.href="CV/Muhammad_Saqib_Kakar_Developer_CV.pdf";button.setAttribute("download","Muhammad_Saqib_Kakar_Developer_CV.pdf");});
