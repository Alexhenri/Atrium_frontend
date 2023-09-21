/*
  ---------------------------------------------------------------------------------------------------
  Function to populate tier in the new form
  ---------------------------------------------------------------------------------------------------
*/

const populatesTierSelectInNewForm = async (tierId, tierName) => {
  const selectElement = document.getElementById('newTierOptions');
  optionElement = document.createElement('option');
  optionElement.value = tierId;
  optionElement.textContent = tierName;
  selectElement.appendChild(optionElement);
}


/*
  ---------------------------------------------------------------------------------------------------
  Function to get all tier data from API GET request and populate tiers in new form
  ---------------------------------------------------------------------------------------------------
*/

const getTierData = async () => {
  let url = 'http://127.0.0.1:5050/tiers';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.tiers.forEach(option => {
          populatesTierSelectInNewForm(option.id, option.name)
        })
      })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  ---------------------------------------------------------------------------------------------------
  Events to populate and to make the new glasses and tier forms 
  ---------------------------------------------------------------------------------------------------
*/

// Function to populate the select object in New Glasses Form
getTierData()

// Add Glasses button to open pop-up 
const openGlassesPopupBtn = document.getElementById("addGlassesOpenButton");
// Add Tier button to open pop-up 
const openTierPopupBtn = document.getElementById("addTierOpenButton");

// Selector for glasses pop-up
const glassesPopup = document.getElementById("glassesPopup");
// Selector for tier pop-up
const tierPopup = document.getElementById("tierPopup");

// Selector for Glasses button to close pop-up
const closeGlassesPopupBtn = document.getElementById("closeGlassesPopupBtn");
// Selector for Glasses button to close pop-up
const closeTierPopupBtn = document.getElementById("closeTierPopupBtn");

// Event to open glasses pop-up
openGlassesPopupBtn.addEventListener("click", function () {
  glassesPopup.style.display = "block";
});

// Event to open tier pop-up
openTierPopupBtn.addEventListener("click", function () {
  tierPopup.style.display = "block";
});

//  Event to close glasses pop-up
closeGlassesPopupBtn.addEventListener("click", function () {
  glassesPopup.style.display = "none";
});

//  Event to close tier pop-up
closeTierPopupBtn.addEventListener("click", function () {
  tierPopup.style.display = "none";
});

/*
  ---------------------------------------------------------------------------------------------------
  Function to remove a glasses from list and call the function that deletes in database
  ---------------------------------------------------------------------------------------------------
*/

const removeElement = () => {
  let close = document.getElementsByClassName("delete-button");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let li_object = this.parentElement.parentElement;
      const glasses_object = li_object.querySelector('#glasses_name'); // Get the nestedDiv within the container

      const nomeItem = glasses_object.textContent;
      if (confirm("Are you sure?")) {
        deleteItem(nomeItem)
        li_object.remove();
        alert("Removed!")
      }
    }
  }
}

/*
  ---------------------------------------------------------------------------------------------------
  Function to get all glasses data from API GET request
  ---------------------------------------------------------------------------------------------------
*/
const getList = async () => {
  const listItems = Array.from(document.querySelectorAll("li"));
  listItems.forEach((item) => item.remove());
  let url = 'http://127.0.0.1:5050/all_glasses';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.glasses.forEach(
        item => addGlassToList(
          nameGlasses = item.name,
          tierSellingPrice = item.tier.selling_price,
          frameMaterial = item.frame_material,
          genderTarget = item.gender_target,
          isSunGlasses = item.is_sunglasses,
          description = item.descr,
          image = item.image
        )
      )
      removeElement();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  ---------------------------------------------------------------------------------------------------
  Event to load the initial page with the glasses
  ---------------------------------------------------------------------------------------------------
*/
getList()


/*
  ---------------------------------------------------------------------------------------------------
  Function to add new glasses to database via API POST request 
  ---------------------------------------------------------------------------------------------------
*/

const postGlasses = async (
  inputName,
  inputGenderTarget,
  inputTier,
  inputIsSungGlasses,
  inputFrameMaterial,
  inputImage,
  inputDescr,
  inputQuantity,
  inputColor
) => {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData();
    formData.append('name', inputName);
    formData.append('gender_target', inputGenderTarget);
    formData.append('tier', inputTier);
    formData.append('is_sunglasses', inputIsSungGlasses);
    formData.append('frame_material', inputFrameMaterial);
    formData.append('image', inputImage);
    formData.append('descr', inputDescr);
    formData.append('quantity', inputQuantity);
    formData.append('color', inputColor);
    console.log('Request Data:', JSON.stringify(Object.fromEntries(formData)));

    let url = 'http://127.0.0.1:5050/glasses';

    try {
      const response = await fetch(url, {
        method: 'post',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 409){
          throw new Error("Sorry but we already have a glasses with the same name in the database");
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      const data = await response.json();
      resolve(data); // Resolve the promise with the response data
    } catch (error) {
      console.error('Error:', error);
      reject(error); // Reject the promise with the error
    }
  });
};


/*
  ----------------------------------------------------------------------------------------------------
  Function to get all glasses from API GET request and then call the addGlassToList function
  ----------------------------------------------------------------------------------------------------
*/

const getGlasseToList = async () => {
  let url = 'http://127.0.0.1:5050/all_glasses';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.glasses)
      data.glasses.forEach(
        item => addGlassToList(
              nameGlasses = item.name,
              tierSellingPrice = item.tier.selling_price,
              frameMaterial = item.frame_material,
              genderTarget = item.gender_target,
              isSunGlasses = item.is_sunglasses,
              description = item.descr,
              image = item.image
            )
      )
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  ----------------------------------------------------------------------------------------------------
  Function to dynamic add the glasses object to html page 
  ----------------------------------------------------------------------------------------------------
*/

const addGlassToList = (
  nameGlasses,
  tierSellingPrice,
  frameMaterial,
  genderTarget,
  isSunGlasses,
  description,
  image 
) => {
  const glassList = document.getElementById("glassList");
  const listItem = document.createElement("li");

  const sunglasses = isSunGlasses === 'True' ? '<span class="attr">Sunglasses</span>' : "";
  const frame_material = frameMaterial === '' ? "" : `<span class="attr">${frameMaterial}</span>` ;
  const gender = genderTarget === 'U' ? 'Unisex' : genderTarget === 'M' ? 'Male' : 'Female';
  const glassImage = image === "" ? 'img/default_image.jpg' : image.includes("https") ? image : "img/" + image;
  // Construct the inner HTML of the list item with dynamic content
  listItem.innerHTML = `
    <div class="glass-info">
        <img src="${glassImage}" class="glass-image" />
        <h2 id="glasses_name">${nameGlasses}</h2>
        ${sunglasses}
        ${frame_material}
        <span class="attr">${gender}</span>
        <p class="teste3">${description}</p>
        <span>R$</span>&nbsp;${tierSellingPrice}</span>
        <button class="delete-button"></button>
    </div>
  `;

  glassList.appendChild(listItem);
}

/*
  ----------------------------------------------------------------------------------------------------
  Function to delete glasses by name via API DELETE request
  ----------------------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5050/glasses?name=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  ----------------------------------------------------------------------------------------------------
  Function to Reset glasses form
  ----------------------------------------------------------------------------------------------------
*/

/*
  ----------------------------------------------------------------------------------------------------
  Function to add new glasses and call function that add it to database via API POST request
  ----------------------------------------------------------------------------------------------------
*/
const newGlasses = () => {
  let inputName = document.getElementById("newInput").value;
  let inputGenderTarget = document.getElementById("newGenderTarget").value;
  let inputTier = document.getElementById("newTierOptions").value;
  let inputIsSungGlasses = document.getElementById("newIsSungGlasses");
  let inputFrameMaterial = document.getElementById("newFrameMaterial").value;
  let inputImage = document.getElementById("newImage").value;
  let inputDescr = document.getElementById("newDescr").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputColor = document.getElementById("newColor").value;


  if (inputName === '') {
    alert("Please enter the glasses name!");
  } else if (inputGenderTarget === '') {
    alert("Please select a gender target!");
  } else if (inputTier === '') {
    alert("Select an existing tier, if there isn't one, add it first!");
  } else {
    if (inputIsSungGlasses.checked) { 
      inputIsSungGlasses = true;
     }
     else{
      inputIsSungGlasses = false;
     }
    postGlasses( inputName, inputGenderTarget, inputTier,
              inputIsSungGlasses, inputFrameMaterial,
              inputImage, inputDescr, inputQuantity, inputColor
    ).then((data) => {
      // Handle successful response
      console.log('Success:', data);
      alert(`Glasses:${inputName} added!`)
      glassesPopup.style.display = "none";
      getList();
    })
    .catch((error) => {
      // Handle the error from the postTier function
      console.error('Error:', error);
      alert(error)
    });
  }   
}

/*
  ---------------------------------------------------------------------------------------------------
  Function to add new glasses to database via API POST request 
  ---------------------------------------------------------------------------------------------------
*/

const postTier = async (inputTierName, inputTierCostValue, inputTierSellingPrice) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('name', inputTierName);
    formData.append('cost_value', inputTierCostValue);
    formData.append('selling_price', inputTierSellingPrice);

    let url = 'http://127.0.0.1:5050/tier';
    fetch(url, {
      method: 'post',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          // Check if the response status is 409
          if (response.status === 409){
            throw new Error("Sorry but we already have a tier with the same name in the database");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        // Check the response data for any application-specific error
        if (data.error) {
          throw new Error(data.error);
        }
        // Resolve the promise with the successful response data
        resolve(data);
      })
      .catch((error) => {
        // Reject the promise with the error
        reject(error);
      });
  });
};


/*
  ----------------------------------------------------------------------------------------------------
  Function to add new tier and call function that add it to database via API POST request
  ----------------------------------------------------------------------------------------------------
*/
const newTier = () => {
  let inputTierName = document.getElementById("newTierInput").value;
  let inputTierCostValue = document.getElementById("newCostValue").value;
  let inputTierSellingPrice = document.getElementById("newSellingPrice").value;

  if (inputTierName === '') {
    alert("Please enter the tier name!");
  } else if (inputTierCostValue === '') {
    alert("Please enter the tier cost value!");
  } else if (inputTierSellingPrice === '') {
    alert("Please enter the tier selling price!");
  } else {
    postTier( inputTierName, inputTierCostValue, inputTierSellingPrice)
    .then((data) => {
      // Handle successful response
      console.log('Success:', data);
      alert("Tier added!")
      populatesTierSelectInNewForm(data.id, data.name);
      tierPopup.style.display = "none";
    })
    .catch((error) => {
      // Handle the error from the postTier function
      console.error('Error:', error);
      alert(error)
    });
  }   
}
