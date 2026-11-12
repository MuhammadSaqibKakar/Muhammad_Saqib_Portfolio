const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav-links");
function closeMenu(){if(!toggle||!nav)return;nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation");}
if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));document.addEventListener("click",e=>{if(e.target instanceof Element&&!nav.contains(e.target)&&!toggle.contains(e.target))closeMenu();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();toggle.focus();}});}
const professionalEmail=["Engrsaqibkakar241","gmail.com"].join("@"),status=document.getElementById("contact-status");
function say(text){if(status)status.textContent=text;}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{const field=document.createElement("textarea");field.value=text;field.readOnly=true;field.className="clipboard-helper";document.body.appendChild(field);field.select();let ok=false;try{ok=document.execCommand("copy");}catch{}field.remove();return ok;}}
document.querySelectorAll(".copy-email-btn,.copy-name-btn").forEach(button=>button.addEventListener("click",async()=>{const text=button.classList.contains("copy-email-btn")?professionalEmail:button.dataset.copyText;if(!text)return;const ok=await copyText(text);say(ok?"Email address copied. Paste it into your usual email app.":"Copy unavailable. Use Engrsaqibkakar241 [at] gmail [dot] com.");if(!status&&ok){const old=button.textContent;button.textContent="Copied";setTimeout(()=>button.textContent=old,1600);}button.focus();}));
const form=document.getElementById("contact-form");
if(form){
  const subjectField=document.getElementById("sender-subject");
  const service=new URLSearchParams(location.search).get("service");
  if(service&&subjectField)subjectField.value=service.slice(0,160);
  const value=id=>document.getElementById(id)?.value.trim()||"";
  const brief=()=>({
    subject:value("sender-subject")+" — "+value("sender-name"),
    body:"Name: "+value("sender-name")+"\nEmail: "+value("sender-email")+"\nBudget: "+(value("project-budget")||"To discuss")+"\nTimeline: "+(value("project-timeline")||"To discuss")+"\n\nProject brief:\n"+value("sender-message")
  });
  const valid=()=>!value("company-website")&&form.reportValidity();
  const openDraft=()=>{
    if(!valid())return;
    const draft=brief();
    location.href="mailto:"+professionalEmail+"?subject="+encodeURIComponent(draft.subject)+"&body="+encodeURIComponent(draft.body);
    say("Your email app should open a draft. Review and send it yourself; nothing has been sent by this button.");
  };
  document.getElementById("email-draft")?.addEventListener("click",openDraft);
  document.getElementById("copy-brief")?.addEventListener("click",async()=>{
    if(!valid())return;
    const draft=brief(),ok=await copyText("Subject: "+draft.subject+"\n\n"+draft.body);
    say(ok?"Project brief copied. Paste it into your email app and send it.":"Copy unavailable. Select the text you entered and copy it manually.");
  });
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!valid())return;
    const button=document.getElementById("send-enquiry");
    if(button?.disabled)return;
    if(button)button.disabled=true;
    form.setAttribute("aria-busy","true");
    say("Submitting your enquiry securely…");
    try{
      const data=new FormData(form);
      const draft=brief();
      data.set("_subject","Portfolio enquiry: "+value("sender-subject"));
      data.set("message",draft.body);
      const response=await fetch("https://formsubmit.co/ajax/"+professionalEmail,{
        method:"POST",
        body:data,
        headers:{"Accept":"application/json"}
      });
      const result=await response.json();
      if(!response.ok||result.success===false||result.success==="false")throw Error("Submission rejected");
      say("Enquiry accepted by the form service. Delivery requires the recipient address to be verified; if this is urgent, use Open email draft as well.");
      form.reset();
    }catch(error){
      say("Online submission could not be confirmed. Your details are still here. Please use Open email draft or Copy brief instead.");
    }finally{
      if(button)button.disabled=false;
      form.removeAttribute("aria-busy");
    }
  });
}
const box=document.getElementById("lightbox"),image=document.getElementById("lightbox-image"),closeButton=document.querySelector(".lightbox-close");
if(box&&image&&closeButton){let opener=null,overflow="";function close(){box.classList.remove("open");box.setAttribute("aria-hidden","true");image.removeAttribute("src");document.body.style.overflow=overflow;opener?.focus();}document.querySelectorAll(".cert-card").forEach(card=>card.addEventListener("click",()=>{if(!card.dataset.full)return;opener=card;overflow=document.body.style.overflow;image.src=card.dataset.full;image.alt=card.querySelector("img")?.alt||"Certificate";box.classList.add("open");box.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";closeButton.focus();}));closeButton.addEventListener("click",close);box.addEventListener("click",e=>{if(e.target===box)close();});document.addEventListener("keydown",e=>{if(!box.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="Tab"){e.preventDefault();closeButton.focus();}});}
