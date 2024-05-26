const inputArea = document.getElementById("search-input");
const resultArea = document.getElementById("result-search");
const audioPlay = document.getElementById("audio");
const arabic = document.getElementById("textarab");
const keteranganSurat = document.getElementById("keteranganSurat");
const audioAyat = document.getElementById("audio-ayat");
let surahId;

const BASE_URL = "https://equran.id/api/v2";
const quranSurah = async () => {
  const endpoint = `${BASE_URL}/surat`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.data;
};
const quranDetail = async (nomor) => {
  const endpoint = `${BASE_URL}/surat/${nomor}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  // console.log(data.data);
  return data.data;
};

quranSurah().then((Surat) => {
  inputArea.addEventListener("input", function (event) {
    const searchValue = event.target.value.toLowerCase();
    resultArea.innerHTML = "";

    if (searchValue !== "") {
      let matches = [];

      Surat.forEach((surah) => {
        const surahName = surah.namaLatin.toLowerCase();
        if (surahName.includes(searchValue)) {
          matches.push(surah);
        }
      });

      if (matches.length > 0) {
        const list = matches.map((match) => {
          return `<a href="" onclick="handlerAyat(event, ${match.nomor})" class="card w-96 bg-base-500 shadow-xl mb-2  hover:bg-green-500"><div class="card-body"><h2 class="card-title">${match.namaLatin} (${match.nama})</h2></div></a>`;
        });
        resultArea.innerHTML = list.join("");
        resultArea.style.display = "block";
      } else {
        resultArea.innerHTML = "Tidak ada hasil yang ditemukan.";
        resultArea.style.display = "block";
      }
    } else {
      resultArea.innerHTML = "";
      resultArea.style.display = "none";
    }
  });
});
async function handlerAyat(event, suratnomor) {
  event.preventDefault();
  const data = await quranDetail(suratnomor);
  function playAudio() {
    audioPlay.play();
  }
  function pauseAudio() {
    audioPlay.pause();
  }
  function audio() {
    const qori = data.audioFull["01"];
    audioPlay.src = qori;
    audioPlay.load();
  }
  const keterangan = ` <dialog id="my_modal_2" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Dekripsi Surat ${data.namaLatin}</h3>
    <p class="py-4 ubuntu-regular">${data.deskripsi}</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<div class="flex flex-col max-w-3xl lg:flex-row mt-5">
  <div
    class="grid flex-grow h-auto card bg-base-300 rounded-box place-items-center p-3 text-xl font-bold ubuntu-regular hover:bg-orange-800 cursor-pointer"
    onclick="my_modal_2.showModal()"
  >
    ${data.namaLatin} (${data.nama})
  </div>
  <div class="divider lg:divider-horizontal"></div>
  <div
    class="grid flex-grow h-16 card bg-base-300 rounded-box place-items-center p-3 text-xl font-bold ubuntu-regular"
  >
    ${data.tempatTurun}
  </div>
  <div class="divider lg:divider-horizontal"></div>
  <div
    class="grid flex-grow h-16 card bg-base-300 rounded-box place-items-center p-3 text-xl font-bold ubuntu-regular"
  >
    ${data.jumlahAyat} ayat
  </div>
  <div class="divider lg:divider-horizontal"></div>
  <button
    onclick="playAudio()"
    type="button"
    class="grid flex-grow h-16 card rounded-box place-items-center bg-base-300 hover:bg-[#852103]"
  >
    <img
      src="play_circle_24dp_FILL0_wght400_GRAD0_opsz24.png"
      class="w-16 h-16 bg-[#d67a56] rounded-full"
    />
  </button>
  <div class="divider lg:divider-horizontal"></div>
  <button
    onclick="pauseAudio()"
    type="button"
    class="grid flex-grow h-16 card rounded-box place-items-center bg-base-300 hover:bg-[#852103]"
  >
    <img
      src="pause_circle_24dp_FILL0_wght400_GRAD0_opsz24.png"
      class="w-16 h-16 bg-[#9c9998] rounded-full"
    />
  </button>
</div>`;
  const ayatHtml = data.ayat
    .map(
      (ayat) =>
        `
      <div class="flex flex-row">
          <div class="collapse mt-4" id="teksArab">
            <input type="checkbox" class="peer" />
            <div
              class="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
            >
              <div class="flex justify-between">
                <div
                  class="ubuntu-regular text-2xl bg-[#FFDA78] rounded-box min-w-10 max-w-16 h-9 text-center"
                >
                  ${ayat.nomorAyat}
                </div>
                <div class="text-2xl text-end amiri-regular leading-loose">
                  ${ayat.teksArab}
                </div>
              </div>
            </div>
            <div
              class="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"
            >
              <p class="text-xl text-justify ubuntu-regular">
                ${ayat.teksIndonesia}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <svg onclick="playAyatAudio('${ayat.audio["01"]}')" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M540-160.67q-64 0-107.67-43.66Q388.67-248 388.67-312t43.66-107.67Q476-463.33 540-463.33q25 0 45.17 6.83 20.16 6.83 39.5 19.83V-800H880v113.33H691.33V-312q0 64-43.66 107.67Q604-160.67 540-160.67ZM80-312q0-98.33 35.33-182.5 35.34-84.17 97-145.83Q274-702 358.17-737q84.16-35 181.83-35v66.67q-84 0-156 29.83t-124.83 82.67Q206.33-540 176.5-468.17 146.67-396.33 146.67-312H80Zm133.33 0q0-70.67 24.84-130.83Q263-503 306.5-546.5t103.17-67.83q59.66-24.34 130.33-24.34V-572q-115.33 0-187.67 72Q280-428 280-312h-66.67Z"/></svg>
          </div>
        </div>`
    )
    .join("");
  resultArea.innerHTML = "";
  inputArea.value = "";
  keteranganSurat.innerHTML = keterangan;
  arabic.innerHTML = ayatHtml;

  window.playAudio = playAudio;
  window.pauseAudio = pauseAudio;
  audio();
}

function playAyatAudio(audioSrc) {
  audioAyat.src = audioSrc;
  audioAyat.load();
  audioAyat.volume = 0.5;
  audioAyat.play();
}


function handlerLogo() {
  keteranganSurat.innerHTML = "";
  arabic.innerHTML = "";
  resultArea.innerHTML = "";
  inputArea.value = "";
}
document.getElementById("logo").onclick = handlerLogo;