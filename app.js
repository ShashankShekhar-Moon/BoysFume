const products = [
  {id:"still", name:"Still", edition:"COMPOSITION Nº 01", size:"100 ML / OBJECT Nº 01", price:0, label:"THE ORIGINAL", description:"The quiet confidence of a clean slate.", image:"assets/product-still.svg"},
  {id:"after", name:"After Hours", edition:"COMPOSITION Nº 02", size:"100 ML / OBJECT Nº 02", price:0, label:"AFTER DARK", description:"For plans that were never really plans.", image:"assets/product-after.svg"},
  {id:"almost", name:"Almost", edition:"COMPOSITION Nº 03", size:"100 ML / OBJECT Nº 03", price:0, label:"LIMITED NOTHING", description:"A little mystery. A lot of restraint.", image:"assets/product-almost.svg"}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const state = { cart: {}, wishlist: new Set(), drawer: null };
const money = amount => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
const getProduct = id => products.find(product => product.id === id);

function renderProducts(){
  const grid = $("[data-product-grid]");
  grid.innerHTML = products.map((product,index)=>`
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name} sculptural fragrance object" loading="${index===0?"eager":"lazy"}">
        <span class="product-label">${product.label}</span>
        <button class="heart-button ${state.wishlist.has(product.id)?"is-saved":""}" data-wishlist="${product.id}" aria-label="${state.wishlist.has(product.id)?"Remove":"Save"} ${product.name}" aria-pressed="${state.wishlist.has(product.id)}">${state.wishlist.has(product.id)?"♥":"♡"}</button>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3 class="product-title">${product.name}</h3><span class="product-price">₹0</span></div>
        <p class="product-subtitle">${product.edition} · ${product.size}</p>
        <p class="product-description">${product.description}</p>
        <button class="add-button" data-add="${product.id}">ADD TO BAG <span>＋</span></button>
      </div>
    </article>`).join("");
}
function cartCount(){return Object.values(state.cart).reduce((sum,item)=>sum+item.qty,0)}
function renderCart(){
  const items = Object.values(state.cart);
  $("[data-cart-count]").textContent = cartCount();
  $("[data-cart-title-count]").textContent = `(${cartCount()})`;
  $("[data-subtotal]").textContent = money(items.reduce((sum,item)=>sum+item.qty*item.product.price,0));
  const target = $("[data-cart-items]");
  if(!items.length){
    target.innerHTML = `<div class="empty-bag"><span class="empty-symbol">○</span><p>Your bag is feeling a little empty.</p><a class="underlined-link" href="#collection" data-continue-shopping>EXPLORE THE COLLECTION ↗</a></div>`;
    return;
  }
  target.innerHTML = items.map(({product,qty})=>`
    <article class="cart-row">
      <img class="cart-thumb" src="${product.image}" alt="">
      <div><h3>${product.name}</h3><div class="cart-meta">${product.edition}</div>
      <div class="qty-control"><button data-qty="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${product.id}" data-delta="1" aria-label="Increase quantity">+</button></div>
      <button class="remove-item" data-remove="${product.id}">REMOVE</button></div>
      <span class="cart-row-price">${money(product.price)}</span>
    </article>`).join("");
}
function renderWishlist(){
  $("[data-wishlist-count]").textContent = state.wishlist.size;
  const target = $("[data-wishlist-items]");
  const saved = products.filter(p=>state.wishlist.has(p.id));
  target.innerHTML = saved.length ? saved.map(p=>`<article class="wishlist-row"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><button data-add="${p.id}">ADD TO BAG</button></div><button data-wishlist="${p.id}" aria-label="Remove ${p.name} from saved">REMOVE</button></article>`).join("") : `<p class="wishlist-empty">Nothing saved. A clean slate.</p>`;
}
function showToast(message){
  const toast = $("[data-toast]");
  toast.textContent = message; toast.classList.add("is-visible");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.remove("is-visible"),2400);
}
function closeDrawers(){
  $("[data-cart-drawer]").classList.remove("is-open");
  $("[data-wishlist-drawer]").classList.remove("is-open");
  $("[data-overlay]").classList.remove("is-visible");
  document.body.classList.remove("locked");
  $("[data-cart-drawer]").setAttribute("aria-hidden","true");
  $("[data-wishlist-drawer]").setAttribute("aria-hidden","true");
  state.drawer=null;
}
function openDrawer(which){
  closeDrawers();
  const drawer = which==="cart" ? $("[data-cart-drawer]") : $("[data-wishlist-drawer]");
  drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden","false");
  $("[data-overlay]").classList.add("is-visible"); document.body.classList.add("locked");
  state.drawer=which;
}
function addToCart(id){
  const product=getProduct(id); if(!product)return;
  if(state.cart[id]) state.cart[id].qty++;
  else state.cart[id]={product,qty:1};
  renderCart(); showToast(`${product.name.toUpperCase()} ADDED TO YOUR BAG.`);
}
function toggleWishlist(id){
  if(state.wishlist.has(id)) state.wishlist.delete(id); else state.wishlist.add(id);
  renderProducts(); renderWishlist();
  showToast(state.wishlist.has(id)?"SAVED FOR LATER.":"REMOVED FROM YOUR SHORTLIST.");
}
function openCheckout(){
  if(!cartCount()){showToast("YOUR BAG IS EMPTY. EVEN BY OUR STANDARDS.");return;}
  closeDrawers();
  const dialog=$("[data-checkout-dialog]");
  if(typeof dialog.showModal==="function") dialog.showModal(); else dialog.setAttribute("open","");
}
function closeCheckout(){
  const dialog=$("[data-checkout-dialog]");
  if(typeof dialog.close==="function") dialog.close(); else dialog.removeAttribute("open");
}
document.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");
  const wish=event.target.closest("[data-wishlist]");
  const qty=event.target.closest("[data-qty]");
  const remove=event.target.closest("[data-remove]");
  if(add){addToCart(add.dataset.add);return}
  if(wish){toggleWishlist(wish.dataset.wishlist);return}
  if(qty){const id=qty.dataset.qty; if(state.cart[id]){state.cart[id].qty+=Number(qty.dataset.delta);if(state.cart[id].qty<1)delete state.cart[id];renderCart()}return}
  if(remove){delete state.cart[remove.dataset.remove];renderCart();return}
  if(event.target.closest("[data-open-cart]")){openDrawer("cart");return}
  if(event.target.closest("[data-open-wishlist]")){renderWishlist();openDrawer("wishlist");return}
  if(event.target.closest("[data-close-cart]")||event.target.closest("[data-close-wishlist]")||event.target.matches("[data-overlay]")){closeDrawers();return}
  if(event.target.closest("[data-checkout]")){openCheckout();return}
  if(event.target.closest("[data-close-checkout]")||event.target.closest("[data-reveal-done]")){closeCheckout();return}
  if(event.target.closest("[data-continue-shopping]")){closeDrawers();return}
  const menuToggle=event.target.closest("[data-menu-toggle]");
  if(menuToggle){const nav=$("[data-mobile-nav]");const open=nav.classList.toggle("is-open");menuToggle.setAttribute("aria-expanded",String(open));return}
  if(event.target.closest("[data-mobile-nav] a")){$("[data-mobile-nav]").classList.remove("is-open");$("[data-menu-toggle]").setAttribute("aria-expanded","false")}
});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDrawers()});
renderProducts();renderCart();renderWishlist();
