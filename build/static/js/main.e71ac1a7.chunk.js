(this.webpackJsonpboilerplate=this.webpackJsonpboilerplate||[]).push([[0],{16:function(e,t,n){e.exports=n(29)},21:function(e,t,n){},22:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},23:function(e,t,n){},29:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(13),l=n.n(r),i=(n(21),n(22),n(14)),s=n(1),c=function(){return o.a.createElement("div",null,"This is the homepage. Sign up",o.a.createElement("div",null,o.a.createElement("form",{onSubmit:function(e){e.preventDefault();fetch("/api/rest-auth/registration/",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({email:e.target.Email.value,username:e.target.Username.value,password1:e.target.Password1.value,password2:e.target.Password2.value})}).then((function(e){return 200!==e.status?e:(console.log("All good"),null)})).then((function(e){null!==e&&console.log("error",e)})).catch((function(e){return console.log(e.message)}))}},"Email:",o.a.createElement("input",{type:"text",name:"Email"}),"Username:",o.a.createElement("input",{type:"text",name:"Username"}),"Password:",o.a.createElement("input",{type:"text",name:"Password1"}),"Confirm Password:",o.a.createElement("input",{type:"text",name:"Password2"}),o.a.createElement("input",{type:"submit"}))))};n(23);var u=function(){return o.a.createElement("div",null,o.a.createElement(i.a,null,o.a.createElement(s.c,null,o.a.createElement(s.a,{path:"/"},o.a.createElement(c,null)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(u,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[16,1,2]]]);
//# sourceMappingURL=main.e71ac1a7.chunk.js.map