(function () {
  const config = window.RECELL_SITE_CONFIG || {};
  const surveyUrl = config.SURVEY_URL || "";
  const videoEmbedUrl = config.VIDEO_EMBED_URL || "";

  const surveyLinks = document.querySelectorAll("[data-survey-link]");
  surveyLinks.forEach((link) => {
    if (surveyUrl && !surveyUrl.includes("example.com")) {
      link.href = surveyUrl;
      link.textContent = "설문조사 참여하기";
      link.removeAttribute("aria-disabled");
    } else {
      link.href = "#survey";
      link.textContent = "설문 링크 준비 중";
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const notice = document.querySelector("[data-survey-notice]");
        if (notice) {
          notice.textContent = "아직 실제 설문 링크가 연결되지 않았습니다. web/config.js에서 SURVEY_URL을 교체해 주세요.";
        }
      });
    }
  });

  const videoSlot = document.querySelector("[data-video-slot]");
  if (videoSlot && videoEmbedUrl) {
    videoSlot.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = videoEmbedUrl;
    iframe.title = "ReCell Light Kit 설명 동영상";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    videoSlot.appendChild(iframe);
  }

  const checkboxes = document.querySelectorAll("[data-progress-check]");
  const progress = document.querySelector("[data-progress-count]");

  function updateProgress() {
    const checked = Array.from(checkboxes).filter((item) => item.checked).length;
    if (progress) {
      progress.textContent = `${checked}/${checkboxes.length}`;
    }
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateProgress);
  });
  updateProgress();

  const missionRows = document.querySelectorAll("[data-mission-row]");
  const saveButton = document.querySelector("[data-save-missions]");
  const resetButton = document.querySelector("[data-reset-missions]");
  const missionStatus = document.querySelector("[data-mission-status]");
  const storageKey = "recell-light-kit-mission-records";

  function collectMissionData() {
    return Array.from(missionRows).map((row) => {
      const fields = row.querySelectorAll("input, select");
      return Array.from(fields).map((field) => field.value);
    });
  }

  function applyMissionData(data) {
    missionRows.forEach((row, rowIndex) => {
      const fields = row.querySelectorAll("input, select");
      fields.forEach((field, fieldIndex) => {
        if (data[rowIndex] && data[rowIndex][fieldIndex] !== undefined) {
          field.value = data[rowIndex][fieldIndex];
        }
      });
    });
  }

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      applyMissionData(JSON.parse(saved));
    }
  } catch (error) {
    if (missionStatus) {
      missionStatus.textContent = "저장된 기록을 불러오지 못했습니다.";
    }
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      localStorage.setItem(storageKey, JSON.stringify(collectMissionData()));
      if (missionStatus) {
        missionStatus.textContent = "이 기기에 실험 기록이 저장되었습니다.";
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      applyMissionData([]);
      if (missionStatus) {
        missionStatus.textContent = "저장된 실험 기록을 비웠습니다.";
      }
    });
  }
})();

