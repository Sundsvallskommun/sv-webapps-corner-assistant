# Sundsvalls Kommun - Corner assistant

Tillägg till Sitevision.
AI-assistent som kan köras i hörn eller fullskärm, likt en klassisk chatbot.

## Dokumentation

För instruktioner om hur modulen läggs till, konfigureras och felsöks i
Sitevision, se [Redaktörsguide för Corner assistant](docs/redaktorsguide-sitevision.md).

## /app

React app.
Detta är assistenten som körs på klientsidan.
Denna kan köras fristående i dev-läge under utveckling.

Läs om hur den fungerar i `./app/README.md`.

När du har byggt appen kopieras den till `/sitevision`.
Detta måste ske innan du kan utveckla och/eller bygga sitevision-appen.

## /sitevision

Sitevision webbapp.
Insticksmodul till Sitevision.

Läs om hur den fungerar i `./sitevision/README.md`.
