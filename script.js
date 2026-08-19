(function() {
  // DOM elements
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  const donateBtn = document.getElementById('donateNowBtn');
  const donateMessage = document.getElementById('donateMessage');
  const donationDisplay = document.getElementById('donationDisplay');

  // current selected amount (default 25)
  let selectedAmount = 25;

  // highlight active button
  function setActiveButton(amount) {
    amountBtns.forEach(btn => {
      const btnAmount = parseInt(btn.getAttribute('data-amount'), 10);
      if (btnAmount === amount) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    // clear custom input if a preset is selected
    if (customInput) customInput.value = '';
  }

  // update selected amount from button click
  amountBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const amount = parseInt(this.getAttribute('data-amount'), 10);
      if (!isNaN(amount) && amount > 0) {
        selectedAmount = amount;
        setActiveButton(amount);
        // hide message when changing amount
        donateMessage.classList.remove('show');
      }
    });
  });

  // custom input: override preselected amount
  customInput.addEventListener('input', function() {
    const val = parseFloat(this.value);
    if (!isNaN(val) && val > 0) {
      selectedAmount = val;
      // remove active class from preset buttons
      amountBtns.forEach(btn => btn.classList.remove('active'));
      // hide previous message
      donateMessage.classList.remove('show');
    }
    // if input is empty or invalid, we keep last valid selectedAmount
  });

  // Donate button handler
  function handleDonate() {
    let amount = selectedAmount;

    // check custom input first (if filled and valid)
    const customVal = parseFloat(customInput.value);
    if (!isNaN(customVal) && customVal > 0) {
      amount = customVal;
    } else if (isNaN(amount) || amount <= 0) {
      // fallback to 25 if nothing selected
      amount = 25;
      // also set active button for 25
      setActiveButton(25);
      selectedAmount = 25;
    }

    // round to 2 decimals
    amount = Math.round(amount * 100) / 100;

    // update display and show message
    donationDisplay.textContent = `$${amount.toFixed(2)}`;
    donateMessage.classList.add('show');

    // log for demo purposes
    console.log(`Donation of $${amount.toFixed(2)} processed (demo)`);
  }

  donateBtn.addEventListener('click', handleDonate);

  // also allow pressing "Enter" in custom input
  customInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDonate();
    }
  });

  // set default active button (25)
  setActiveButton(25);
  selectedAmount = 25;
})();