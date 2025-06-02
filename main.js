import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc, addDoc, getDocs, getDoc, query, collection, where, orderBy, increment, updateDoc, onSnapshot, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEqowcf_n6iuVD1RR2DeFffHqWSMZl88M",
  authDomain: "wholesalepro-433db.firebaseapp.com",
  projectId: "wholesalepro-433db",
  storageBucket: "wholesalepro-433db.firebasestorage.app",
  messagingSenderId: "922966102079",
  appId: "1:922966102079:web:82b26efdf5316662ad288a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();


//show notifications function
function showNotification(message) {
  const popup = document.getElementById('popupNotification');
  popup.textContent = message;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 1500); // Show for 1 second
}

// Reference to the login elements
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Global user object (will be filled on successful login)
let user = null;

const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('login-password');

// SVG strings for quick swapping
const eyeOpenSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon eye-icon" viewBox="0 0 512 512">
  <path d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
  <circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
</svg>`;

const eyeClosedSVG = `
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon eye-icon" viewBox="0 0 512 512">
  <path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"/>
  <path d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"/>
</svg>`;

togglePasswordBtn.innerHTML = eyeClosedSVG;

togglePasswordBtn.addEventListener('click', () => {
  const isPasswordVisible = passwordInput.type === 'text';

  if (isPasswordVisible) {
    // Hide password
    passwordInput.type = 'password';
    togglePasswordBtn.innerHTML = eyeClosedSVG;
    togglePasswordBtn.setAttribute('aria-label', 'Show password');
  } else {
    // Show password
    passwordInput.type = 'text';
    togglePasswordBtn.innerHTML = eyeOpenSVG;
    togglePasswordBtn.setAttribute('aria-label', 'Hide password');
  }
});
document.title = "Login Page";


// Login handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const uid = document.getElementById('login-uid').value.trim();
  const password = document.getElementById('login-password').value.trim();

  try {
    const userDocRef = doc(getFirestore(), 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      loginError.textContent = 'User not found.';
      return;
    }

    const userData = userDoc.data();

    if (userData.password !== password) {
      loginError.textContent = 'Incorrect password.';
      return;
    }

    // Set user data globally and show the main app
    user = { uid, ...userData };


    // Hide login, show main content
    loginSection.style.display = 'none';
    document.querySelector('header').style.display = 'block';
    document.querySelector('main').style.display = 'block';
    document.querySelector('footer').style.display = 'block';

    // Now start the app logic
    main();

  } catch (err) {
    console.error('Login error:', err);
    loginError.textContent = 'An error occurred. Please try again.';
  }
});

const main = () => {
  document.title = "WholeSale Pro";
  // Simple SPA Navigation
  const navLinks = document.querySelectorAll('#nav-links li');
  const sections = document.querySelectorAll('main section');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      // Add active class to clicked link and matching section
      link.classList.add('active');
      const sectionId = link.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Declare SVG icons
  const inStockIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" width="16" height="16">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96"/>
  </svg>`;

  const outOfStockIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" width="16" height="16">
    <circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
    <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M108.92 108.92l294.16 294.16"/>
  </svg>`;

  // Render products
  onSnapshot(collection(db, 'products'), () => {
    // Product rendering with parameters and stock logic
    function renderProducts(products, el_ID) {
      const productListEl = document.getElementById(el_ID);
      productListEl.innerHTML = '';

      products.forEach((p) => {
        const inputId = `${p.name}_qty`;
        const availableStock = (p.stock || 0) - (p.totalOrders || 0);
        const isInStock = availableStock > 0;

        const stockStatusHTML = isInStock
          ? `<span class="stock-status in-stock">${inStockIcon} In Stock</span>`
          : `<span class="stock-status out-of-stock">${outOfStockIcon} Out of Stock</span>`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="product-info-block">
        <h4>${p.name}</h4>
        <div class="price">BDT. ${p.price}</div>
        <div class="stock-status">
          ${stockStatusHTML}
        </div>
        <div class="price-quantity-row">
          <input
            type="number"
            id="${inputId}"
            value="1"
            min="1"
            class="qty-input"
          />
          <button class="add-to-cart">Add to Cart</button>
        </div>
      </div>
      `;

        productListEl.appendChild(card);

        card.querySelector('.add-to-cart').addEventListener('click', async () => {
          if (!isInStock) {
            showNotification(`"${p.name}" is currently out of stock.`);
            return;
          }

          const quantity = parseInt(document.getElementById(inputId).value);

          if (!quantity || quantity < 1) {
            showNotification("Please enter a valid quantity.");
            return;
          }

          if (quantity > availableStock) {
            showNotification(`Only ${availableStock} unit(s) of "${p.name}" available. Please reduce the quantity.`);
            return;
          }

          await setDoc(doc(db, 'users', user.uid, 'cart', p.name), {
            productName: p.name,
            img: p.img,
            price: p.price,
            quantity,
            totalPrice: parseFloat(p.price) * quantity,
          });

          showNotification(`"${p.name}" added to your cart.`);
        });
      });
    }

    function renderFilteredSections(selectedType, sortOrder) {
      const container = document.getElementById('product-sections');
      container.innerHTML = '';

      for (const [type, products] of Object.entries(groupedProducts)) {
        if (selectedType !== 'All' && selectedType !== type) continue;

        // Clone products array before sorting
        const sortedProducts = [...products];

        if (sortOrder === 'low-high') {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'high-low') {
          sortedProducts.sort((a, b) => b.price - a.price);
        }

        const section = document.createElement('div');
        section.className = 'product-type-section';
        section.innerHTML = `
      <h2 class="product-type-title">${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <div class="product-list" id="list-${type}"></div>
    `;
        container.appendChild(section);

        renderProducts(sortedProducts, `list-${type}`);
      }
    }

    //product section
    let groupedProducts = {}; // Stores all grouped products
    const productSection = async () => {
      const container = document.getElementById('product-sections');
      const filterSelect = document.getElementById('filter-select');
      const sortSelect = document.getElementById('sort-select');
      container.innerHTML = '';
      filterSelect.innerHTML = '';
      sortSelect.value = 'default';

      const allProductsSnapshot = await getDocs(collection(db, 'products'));
      const allProducts = allProductsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group products by type
      groupedProducts = {};
      allProducts.forEach(p => {
        if (!groupedProducts[p.type]) groupedProducts[p.type] = [];
        groupedProducts[p.type].push(p);
      });

      // Populate filter dropdown
      const allOption = document.createElement('option');
      allOption.value = 'All';
      allOption.textContent = 'All';
      filterSelect.appendChild(allOption);

      Object.keys(groupedProducts).forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        filterSelect.appendChild(option);
      });

      // Event listeners
      filterSelect.addEventListener('change', () => {
        renderFilteredSections(filterSelect.value, sortSelect.value);
      });

      sortSelect.addEventListener('change', () => {
        renderFilteredSections(filterSelect.value, sortSelect.value);
      });

      // Initial render
      renderFilteredSections('All', 'default');
    };
    productSection();
  });

  //cart section
  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  function renderCartFromFirestore() {
    const cartRef = collection(db, 'users', user.uid, 'cart');

    onSnapshot(cartRef, snapshot => {
      const cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const cartContainer = document.getElementById('cart-items');
      const emptyMessage = document.getElementById('cart-empty');
      const totalDisplay = document.getElementById('cart-summary');

      cartContainer.innerHTML = '';
      // Update cart count in nav
      document.getElementById('cart-count').textContent = cartItems.length;

      cartContainer.innerHTML = '';

      if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        confirmOrderBtn.style.display = 'none';
        totalDisplay.style.display = 'none';
        return;
      } else {
        emptyMessage.style.display = 'none';
        confirmOrderBtn.style.display = 'inline-block';
        totalDisplay.style.display = 'block';
      }

      let totalCost = 0;

      cartItems.forEach(item => {
        totalCost += item.totalPrice;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.productName}" class="cart-img" />
          <div class="cart-item-info">
            <h4>${item.productName}</h4>
            <p class="price">Unit Price: <strong>BDT ${item.price}</strong></p>
            <p class="total-price">Total: <strong>BDT ${item.totalPrice.toFixed(2)}</strong></p>
            <div class="quantity">
              Quantity:
              <input type="number" min="1" value="${item.quantity}" class="UCQ" />
            </div>
            <div class="cart-controls">
              <button class="rmvItm">Remove</button>
            </div>
          </div>
        </div>
        <hr />
      `;
        cartContainer.appendChild(cartItem);

        const qtyInput = cartItem.querySelector('.UCQ');
        if (qtyInput) {
          qtyInput.addEventListener('change', (e) => {
            updateCartQuantity(item.id, e.target.value);
          });
        }

        const rmvBtn = cartItem.querySelector('.rmvItm');
        if (rmvBtn) {
          rmvBtn.addEventListener('click', () => removeCartItem(item.id));
        }
      });

      document.getElementById('cart-total').textContent = totalCost.toFixed(2);
    });
  }
  renderCartFromFirestore();
  //product search
  document.getElementById('product-search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const productName = card.querySelector('h4').textContent.toLowerCase();
      if (productName.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
  //update cart quantity function
  async function updateCartQuantity(docId, newQty) {
    const cartDocRef = doc(db, 'users', user.uid, 'cart', docId);
    const newQuantity = parseInt(newQty);
    if (newQuantity < 1) return removeCartItem(docId);

    const docSnap = await getDoc(cartDocRef);
    if (docSnap.exists()) {
      const price = docSnap.data().price;
      await updateDoc(cartDocRef, {
        quantity: newQuantity,
        totalPrice: newQuantity * price
      });
    }
  }
  //remove cart function
  async function removeCartItem(docId) {
    await deleteDoc(doc(db, 'users', user.uid, 'cart', docId));
  }
  //confirm order function
  confirmOrderBtn.addEventListener('click', async () => {
    try {
      const cartSnapshot = await getDocs(collection(db, 'users', user.uid, 'cart'));

      const cartItems = cartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (cartItems.length === 0) {
        showNotification("Your cart is empty.");
        return;
      }

      // Optional: Validate stock is available
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.productName);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          showNotification(`Product "${item.productName}" no longer exists.`);
          return;
        }

        const currentStock = productSnap.data().stock || 0;

        if (item.quantity > currentStock) {
          showNotification(`Insufficient stock for "${item.productName}". Only ${currentStock} unit(s) available.`);
          return;
        }
      }

      const totalAmount = parseFloat(document.getElementById('cart-total').textContent);

      const docRef = await addDoc(collection(db, "orders"), {
        customerName: user.name,
        customerUID: user.uid,
        items: cartItems,
        status: "Pending",
        orderDate: new Date(),
        totalAmount,
      });

      await updateDoc(doc(db, "orders", docRef.id), {
        orderId: docRef.id,
      });

      // Update totalOrders for each product
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.productName);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const prevTotalOrders = productSnap.data().totalOrders || 0;
          const updatedTotalOrders = prevTotalOrders + item.quantity;

          await updateDoc(productRef, {
            totalOrders: updatedTotalOrders,
            // Optionally update stock (commented out):
            // stock: Math.max((productSnap.data().stock || 0) - item.quantity, 0),
          });
        }
      }

      // Clear cart after successful order
      for (const item of cartSnapshot.docs) {
        await deleteDoc(doc(db, 'users', user.uid, 'cart', item.id));
      }

      showNotification('Your order has been placed!');
    } catch (error) {
      console.error("Order confirmation failed:", error);
      showNotification('Something went wrong. Please try again.');
    }
  });
  //orders section
  async function loadUserLastOrder() {
    onSnapshot(collection(db, 'orders'), async () => {
      const orderList = document.getElementById('order-list');
      const orderTotal = document.getElementById('order-total');
      const noOrdersMsg = document.getElementById('no-orders-msg');

      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerUID', '==', user.uid),
        orderBy('orderDate', 'desc')
      );

      const querySnapshot = await getDocs(ordersQuery);

      if (querySnapshot.empty) {
        noOrdersMsg.style.display = 'block';
        orderList.innerHTML = '';
        orderTotal.textContent = '';
        return;
      }

      noOrdersMsg.style.display = 'none';
      orderList.innerHTML = '';

      let grandTotal = 0;

      querySnapshot.forEach(orderDoc => {
        const order = orderDoc.data();
        const items = order.items || [];
        const orderDate = order.orderDate?.toDate().toLocaleDateString() || 'Unknown';
        const status = order.status || 'Pending';

        let orderTotal = 0;

        const orderBlock = document.createElement('div');
        orderBlock.className = 'user-order-block';

        let orderHeader = `
        <div class="order-header">
          <h3>Order ID: ${orderDoc.id}</h3>
          <p><strong>Date:</strong> ${orderDate}</p>
          <p><strong>Status:</strong> ${status}</p>
      `;

        if (status.toLowerCase() === 'pending') {
          orderHeader += `
          <button class="cancel-order-btn" data-id="${orderDoc.id}">Cancel Order</button>
        `;
        }

        orderHeader += `</div>`;

        let itemsHTML = `<div class="order-block-items">`;

        items.forEach(item => {
          orderTotal += item.totalPrice;
          itemsHTML += `
          <div class="order-item">
            <img src="${item.img}" alt="${item.productName}" />
            <div class="order-info">
              <h4>${item.productName}</h4>
              <p>Quantity: ${item.quantity}</p>
              <p>Unit Price: BDT ${item.price}</p>
              <p>Total: BDT ${item.totalPrice.toFixed(2)}</p>
            </div>
          </div>
        `;
        });

        itemsHTML += `</div>`;

        orderBlock.innerHTML = `
        ${orderHeader}
        ${itemsHTML}
        <div class="order-subtotal"><strong>Subtotal:</strong> BDT ${orderTotal.toFixed(2)}</div>
        <hr />
      `;

        orderList.appendChild(orderBlock);
        grandTotal += orderTotal;
      });

      orderTotal.textContent = `Total Spent: BDT ${grandTotal.toFixed(2)}`;

      // Cancel order logic
      const cancelButtons = document.querySelectorAll('.cancel-order-btn');
      cancelButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
          const orderId = e.target.getAttribute('data-id');
          const confirmCancel = confirm('Are you sure you want to cancel (delete) this order?');

          if (!confirmCancel) return;

          try {
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (!orderSnap.exists()) {
              showNotification('Order not found.');
              return;
            }

            const orderData = orderSnap.data();
            const items = orderData.items || [];

            // Update totalOrders for each product
            for (const item of items) {
              const productRef = doc(db, 'products', item.productName);
              await updateDoc(productRef, {
                totalOrders: increment(-item.quantity)
              });
            }

            // Delete the order
            await deleteDoc(orderRef);
            showNotification('Order deleted successfully.');

          } catch (error) {
            console.error('Error canceling order:', error);
            showNotification('Failed to delete order. Please try again.');
          }
        });
      });
    });
  }
  loadUserLastOrder();
  //history section
  async function loadDeliveredOrders() {
    await onSnapshot(collection(db, 'users', user.uid, 'orderHistory'), async () => {
      const historyList = document.getElementById('history-orders-list');
      const historyMsg = document.getElementById('history-orders-msg');

      historyList.innerHTML = '';
      historyMsg.style.display = 'none';

      const historyRef = collection(db, 'users', user.uid, 'orderHistory');
      const querySnapshot = await getDocs(query(historyRef, orderBy('orderDate', 'desc')));

      if (querySnapshot.empty) {
        historyMsg.style.display = 'block';
        return;
      }

      querySnapshot.forEach(orderDoc => {
        const order = orderDoc.data();
        const items = order.items || [];
        const orderDate = order.orderDate?.toDate().toLocaleDateString() || 'Unknown';
        const status = order.status || 'Delivered';

        let total = 0;
        let itemsHTML = '';

        items.forEach(item => {
          total += item.totalPrice;
          itemsHTML += `
        <div class="history-item">
          <img src="${item.img}" alt="${item.productName}" />
          <div>
            <h4>${item.productName}</h4>
            <p>Qty: ${item.quantity}</p>
            <p>Unit Price: BDT ${item.price}</p>
            <p>Total: BDT ${item.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      `;
        });

        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-history-block';
        orderDiv.innerHTML = `
      <div class="history-header">
        <h3>Order ID: ${orderDoc.id}</h3>
        <p><strong>Date:</strong> ${orderDate}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
      <div class="history-items">${itemsHTML}</div>
      <div class="history-subtotal"><strong>Subtotal:</strong> BDT ${total.toFixed(2)}</div>
      <hr/>
    `;
        historyList.appendChild(orderDiv);
      });
    })
  }
  loadDeliveredOrders();

  const loadAbout = async () => {
    const compSnap = await getDoc(doc(db, 'companyDetails', 'links'));
    const companyLinks = compSnap.data();

    const companyEmail = document.getElementById('companyEmail');
    const companyPhone = document.getElementById('companyPhone');
    const companyFacebook = document.getElementById('companyFacebook');

    companyEmail.textContent = `${companyLinks.email}`;
    companyEmail.href = `mailto:${companyLinks.email}`;
    companyEmail.target = '_blank';

    companyPhone.textContent = companyLinks.phone;
    companyPhone.href = `tel:${companyLinks.phone}`;

    companyFacebook.textContent = companyLinks.facebook;
    companyFacebook.href = companyLinks.facebook;
    companyFacebook.target = '_blank';
  }
  loadAbout()
}
