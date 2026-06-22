/* ═══════════════════════════════════════════════
   Walidacja formularza współpracy
   ═══════════════════════════════════════════════ */

document.getElementById("wspolpracaForm").addEventListener("submit", function (e) {

    e.preventDefault();

    /* ─────────────────────────────────────────────
       INPUTY
    ───────────────────────────────────────────── */
    const imie          = document.getElementById("imie").value.trim();
    const nazwisko      = document.getElementById("nazwisko").value.trim();
    const email         = document.getElementById("email").value.trim();
    const telefon       = document.getElementById("telefon").value.trim();
    const miasto        = document.getElementById("miasto").value.trim();
    const dataUrodzenia = document.getElementById("dataUrodzenia").value;
    const dostepnosc    = document.getElementById("dostepnosc").value;
    const portfolio     = document.getElementById("portfolio").value.trim();
    const wynagrodzenie = document.getElementById("wynagrodzenie").value;
    const motywacja     = document.getElementById("motywacja").value.trim();

    /* SELECTY */
    const stanowisko = document.getElementById("stanowisko").value;
    const tryb       = document.getElementById("tryb").value;
    const zrodlo     = document.getElementById("zrodlo").value;

    /* RANGE */
    const staz         = document.getElementById("staz").value;
    const umiejetnosci = document.getElementById("umiejetnosci").value;

    /* COLOR */
    const kolorMetalu = document.getElementById("kolorMetalu").value;

    /* RADIO — płeć */
    let plec = "";
    const radiosPlec = document.getElementsByName("plec");
    for (let radio of radiosPlec) {
        if (radio.checked) {
            plec = radio.value;
        }
    }

    /* RADIO — lokalizacja */
    let lokalizacja = "";
    const radiosLok = document.getElementsByName("lokalizacja");
    for (let radio of radiosLok) {
        if (radio.checked) {
            lokalizacja = radio.value;
        }
    }

    /* CHECKBOXY — specjalizacje */
    let specjalizacje = [];
    const checkboxSpecjalizacje = document.getElementsByName("specjalizacje");
    for (let checkbox of checkboxSpecjalizacje) {
        if (checkbox.checked) {
            specjalizacje.push(checkbox.value);
        }
    }

    /* CHECKBOXY — języki */
    let jezyki = [];
    const checkboxJezyki = document.getElementsByName("jezyki");
    for (let checkbox of checkboxJezyki) {
        if (checkbox.checked) {
            jezyki.push(checkbox.value);
        }
    }

    /* CV */
    const cvPlik    = document.getElementById("cvPlik").files;
    const zdjeciaPrac = document.getElementById("zdjeciaPrac").files;

    /* CHECKBOX — RODO */
    const rodo = document.getElementById("rodo").checked;

    /* ─────────────────────────────────────────────
       WALIDACJA — resetowanie wszystkich błędów
    ───────────────────────────────────────────── */
    resetAllErrors();
    let valid = true;

    /* --- Imię --- */
    if (imie === "") {
        pokazBlad("imie", "Imię jest wymagane.");
        valid = false;
    }

    /* --- Nazwisko --- */
    if (nazwisko === "") {
        pokazBlad("nazwisko", "Nazwisko jest wymagane.");
        valid = false;
    }

    /* --- Email --- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        pokazBlad("email", "Adres e-mail jest wymagany.");
        valid = false;
    } else if (!emailRegex.test(email)) {
        pokazBlad("email", "Podaj prawidłowy adres e-mail.");
        valid = false;
    }

    /* --- Data urodzenia --- */
    if (dataUrodzenia === "") {
        pokazBlad("dataUrodzenia", "Data urodzenia jest wymagana.");
        valid = false;
    } else {
        /* Sprawdzanie czy kandydat ma co najmniej 18 lat */
        const dzisiaj = new Date();
        const urodziny = new Date(dataUrodzenia);
        const wiek = dzisiaj.getFullYear() - urodziny.getFullYear();
        const miesiac = dzisiaj.getMonth() - urodziny.getMonth();
        const pelnoletni = wiek > 18 || (wiek === 18 && miesiac >= 0);
        if (!pelnoletni) {
            pokazBlad("dataUrodzenia", "Kandydat musi mieć ukończone 18 lat.");
            valid = false;
        }
    }

    /* --- Miasto --- */
    if (miasto === "") {
        pokazBlad("miasto", "Podaj miasto zamieszkania.");
        valid = false;
    }

    /* --- Stanowisko (select) --- */
    if (stanowisko === "") {
        pokazBlad("stanowisko", "Wybierz stanowisko, o które się ubiegasz.");
        valid = false;
    }

    /* --- Tryb współpracy (select) --- */
    if (tryb === "") {
        pokazBlad("tryb", "Wybierz preferowany tryb współpracy.");
        valid = false;
    }

    /* --- Specjalizacje (checkboxy) --- */
    if (specjalizacje.length === 0) {
        pokazBladBezPola("err-specjalizacje", "Zaznacz co najmniej jedną specjalizację.");
        valid = false;
    }

    /* --- Lokalizacja (radio) --- */
    if (lokalizacja === "") {
        pokazBladBezPola("err-lokalizacja", "Wybierz preferowaną lokalizację pracy.");
        valid = false;
    }

    /* --- CV (plik) --- */
    if (cvPlik.length === 0) {
        pokazBladBezPola("err-cvPlik", "Dołącz plik CV lub portfolio.");
        valid = false;
    } else {
        /* Sprawdzanie typ pliku */
        const dozwolone = ["application/pdf", "application/msword",
                           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                           "image/jpeg", "image/png"];
        if (!dozwolone.includes(cvPlik[0].type)) {
            pokazBladBezPola("err-cvPlik", "Dozwolone formaty: PDF, DOC, DOCX, JPG, PNG.");
            valid = false;
        }

        /* Sprawdzanie rozmiaru pliku — max 10 MB */
        const maxMB = 10 * 1024 * 1024;
        if (cvPlik[0].size > maxMB) {
            pokazBladBezPola("err-cvPlik", "Plik jest za duży. Maksymalny rozmiar to 10 MB.");
            valid = false;
        }
    }

    /* --- List motywacyjny (textarea) — min. 50 znaków --- */
    if (motywacja === "") {
        pokazBlad("motywacja", "List motywacyjny jest wymagany.");
        valid = false;
    } else if (motywacja.length < 50) {
        pokazBlad("motywacja", "List motywacyjny musi mieć co najmniej 50 znaków (teraz: " + motywacja.length + ").");
        valid = false;
    }

    /* --- RODO (checkbox) --- */
    if (!rodo) {
        pokazBladBezPola("err-rodo", "Zgoda na przetwarzanie danych jest wymagana.");
        valid = false;
    }

    /* ─────────────────────────────────────────────
       Jeśli błędy — przewiń do pierwszego
    ───────────────────────────────────────────── */
    if (!valid) {
        const pierwszyBlad = document.querySelector(".field-error.show");
        if (pierwszyBlad) {
            pierwszyBlad.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    }

    /* ─────────────────────────────────────────────
       ZEBRANIE DANYCH — obiekt formularza
    ───────────────────────────────────────────── */
    const daneFormularza = {
        imie,
        nazwisko,
        email,
        telefon: telefon || "—",
        miasto,
        dataUrodzenia,
        plec: plec || "nie podano",
        stanowisko,
        tryb,
        dostepnosc: dostepnosc || "—",
        staz: staz + (staz === "30" ? "+ lat" : staz === "1" ? " rok" : " lat"),
        umiejetnosci: umiejetnosci + "/10",
        specjalizacje: specjalizacje.join(", "),
        jezyki: jezyki.length ? jezyki.join(", ") : "nie podano",
        lokalizacja,
        kolorMetalu,
        portfolio: portfolio || "—",
        wynagrodzenie: wynagrodzenie ? wynagrodzenie + " PLN" : "do negocjacji",
        zrodlo: zrodlo || "—",
        motywacja,
        cvPlikNazwa: cvPlik[0].name,
        zdjeciaPrac: zdjeciaPrac.length ? zdjeciaPrac.length + " plik(ów)" : "brak",
        rodo: "wyrażono zgodę"
    };

    console.log("=== WERMON — Dane formularza współpracy ===");
    console.table(daneFormularza);

    /* ─────────────────────────────────────────────
       WYSYŁKA — animacja i ekran sukcesu
    ───────────────────────────────────────────── */
    const btn = document.querySelector(".btn-wspolpraca");
    btn.textContent = "Wysyłanie…";
    btn.disabled = true;

    setTimeout(function () {
        document.getElementById("wspolpracaForm").style.display = "none";
        document.querySelector(".form-submit-area").style.display = "none";
        document.getElementById("successOverlay").classList.add("show");

        /* Pasek postępu — 100% przy sukcesie */
        document.getElementById("progressFill").style.width = "100%";
        document.querySelectorAll(".progress-step").forEach(function (s) {
            s.classList.remove("active");
            s.classList.add("done");
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
});

/* ─────────────────────────────────────────────
   POMOCNICZE — pokazywanie / ukrywanie błędów
───────────────────────────────────────────── */

/* Błąd z polem*/
function pokazBlad(fieldId, komunikat) {
    const pole = document.getElementById(fieldId);
    const blad = document.getElementById("err-" + fieldId);
    if (pole) pole.classList.add("error");
    if (blad) {
        blad.textContent = komunikat;
        blad.classList.add("show");
    }
}

/* Błąd tylko tekst */
function pokazBladBezPola(errId, komunikat) {
    const blad = document.getElementById(errId);
    if (blad) {
        blad.textContent = komunikat;
        blad.classList.add("show");
    }
}

/* Reset wszystkich błędów przed ponowną walidacją */
function resetAllErrors() {
    document.querySelectorAll(".field-error").forEach(function (el) {
        el.classList.remove("show");
    });
    document.querySelectorAll(".ankieta-input, .ankieta-select, .ankieta-textarea").forEach(function (el) {
        el.classList.remove("error");
    });
}

/* ─────────────────────────────────────────────
   LIVE — czyszczenie błądu przy wpisywaniu / zmianie
───────────────────────────────────────────── */
document.querySelectorAll(".ankieta-input, .ankieta-select, .ankieta-textarea").forEach(function (el) {
    el.addEventListener("input", function () {
        el.classList.remove("error");
        const blad = document.getElementById("err-" + el.id);
        if (blad) blad.classList.remove("show");
    });
    el.addEventListener("change", function () {
        el.classList.remove("error");
        const blad = document.getElementById("err-" + el.id);
        if (blad) blad.classList.remove("show");
    });
});

/* Czyszczenie błądu checkboxów specjalizacje przy zaznaczeniu */
document.getElementsByName("specjalizacje").forEach(function (cb) {
    cb.addEventListener("change", function () {
        document.getElementById("err-specjalizacje").classList.remove("show");
    });
});

/* Czyszczenie błądu radio lokalizacja */
document.getElementsByName("lokalizacja").forEach(function (r) {
    r.addEventListener("change", function () {
        document.getElementById("err-lokalizacja").classList.remove("show");
    });
});

/* Czyszczenie błądów RODO */
document.getElementById("rodo").addEventListener("change", function () {
    document.getElementById("err-rodo").classList.remove("show");
});

/* ─────────────────────────────────────────────
   RANGE — aktualizacja wartości na żywo
───────────────────────────────────────────── */
document.getElementById("staz").addEventListener("input", function () {
    const v = parseInt(this.value);
    const el = document.getElementById("stazValue");
    if (v === 0) el.textContent = "Brak doświadczenia";
    else if (v === 30) el.textContent = "30+ lat";
    else el.textContent = v + (v === 1 ? " rok" : v < 5 ? " lata" : " lat");
    updateProgress();
});

document.getElementById("umiejetnosci").addEventListener("input", function () {
    document.getElementById("umiejetnosciValue").textContent = this.value + " / 10";
});

/* ─────────────────────────────────────────────
   COLOR — aktualizacja nazwy koloru
───────────────────────────────────────────── */
document.getElementById("kolorMetalu").addEventListener("input", function () {
    document.getElementById("kolorNazwa").textContent = this.value;
});

/* ─────────────────────────────────────────────
   FILE — wyświetlanie nazwy wybranego pliku
───────────────────────────────────────────── */
document.getElementById("cvPlik").addEventListener("change", function () {
    const el = document.getElementById("cvFileName");
    el.textContent = this.files.length ? this.files[0].name : "Nie wybrano pliku";
    document.getElementById("err-cvPlik").classList.remove("show");
    updateProgress();
});

document.getElementById("zdjeciaPrac").addEventListener("change", function () {
    const el = document.getElementById("zdjeciaFileName");
    if (this.files.length > 1) {
        el.textContent = this.files.length + " pliki wybrane";
    } else if (this.files.length === 1) {
        el.textContent = this.files[0].name;
    } else {
        el.textContent = "Nie wybrano pliku";
    }
});

/* ─────────────────────────────────────────────
   LICZNIK ZNAKÓW
───────────────────────────────────────────── */
document.getElementById("motywacja").addEventListener("input", function () {
    const len = this.value.trim().length;
    document.getElementById("charCount").textContent = len + " / min. 50 znaków";
    if (len >= 50) {
        this.classList.remove("error");
        const blad = document.getElementById("err-motywacja");
        if (blad) blad.classList.remove("show");
    }
    updateProgress();
});

/* ─────────────────────────────────────────────
   PASEK POSTĘPU
───────────────────────────────────────────── */
function updateProgress() {
    const kroki = [
        document.getElementById("imie").value.trim() !== "",
        document.getElementById("nazwisko").value.trim() !== "",
        document.getElementById("email").value.trim() !== "",
        document.getElementById("dataUrodzenia").value !== "",
        document.getElementById("miasto").value.trim() !== "",
        document.getElementById("stanowisko").value !== "",
        document.getElementById("tryb").value !== "",
        document.querySelectorAll("[name='lokalizacja']:checked").length > 0,
        document.getElementById("motywacja").value.trim().length >= 50,
        document.getElementById("cvPlik").files.length > 0,
        document.getElementById("rodo").checked
    ];

    const wypelnione = kroki.filter(Boolean).length;
    const procent = (wypelnione / kroki.length) * 100;

    document.getElementById("progressFill").style.width = procent + "%";

    const progi = [0, 28, 55, 82];
    const nazwyKrokow = ["step1", "step2", "step3", "step4"];

    nazwyKrokow.forEach(function (id, i) {
        const el = document.getElementById(id);
        el.classList.remove("active", "done");
        if (procent >= (progi[i + 1] || 101)) {
            el.classList.add("done");
        } else if (procent >= progi[i]) {
            el.classList.add("active");
        }
    });
}

/* Nasłuchuje zmiany dla paska postępu */
["imie", "nazwisko", "email", "dataUrodzenia", "miasto", "stanowisko", "tryb", "motywacja"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateProgress);
});

document.getElementsByName("lokalizacja").forEach(function (r) {
    r.addEventListener("change", updateProgress);
});

document.getElementById("rodo").addEventListener("change", updateProgress);

/* ─────────────────────────────────────────────
   18 lat wstecz
───────────────────────────────────────────── */
(function () {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    const sformatowana = d.toISOString().split("T")[0];
    document.getElementById("dataUrodzenia").max = sformatowana;
})();

updateProgress();