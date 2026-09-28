# Redaktörsguide för Corner assistant i Sitevision

Den här guiden beskriver hur du som Sitevision-redaktör lägger till och ställer
in **Corner assistant** på en sida. Assistenten visas som en chattknapp i ett
hörn av webbläsarfönstret och kan, om funktionen är aktiverad, öppnas i
fullskärmsläge.

Namn på menyer och knappar kan skilja sig något mellan olika
Sitevision-versioner och behörighetsnivåer.

## Så fungerar kopplingen

Webbappen kommunicerar inte direkt med den bakomliggande AI-tjänsten. Anropen
går via en proxy som autentiserar och vidarebefordrar dem. Modulens
**Assistentens ID** och **Applikation** måste därför stämma exakt med
konfigurationen i proxyn.

En administratör ansvarar normalt för proxyadressen och övriga globala
inställningar. Lägg inte API-nycklar eller andra hemligheter i modulens fält,
metadata eller egen CSS.

## Innan du börjar

Kontrollera att:

- webbappen **Corner assistant** är installerad i Sitevision-miljön,
- du har behörighet att redigera sidan och webbappsmodulen,
- du har fått **Assistentens ID** och **Applikation** från den som administrerar
  proxyn,
- en administratör har angett rätt **Url till AI-server** i webbappens globala
  inställningar,
- sidans domän är tillåten som origin/host i proxyn.

Använd normalt bara en instans av Corner assistant på samma sida. Webbappen är
en sidövergripande hörnassistent, inte en modul som placeras visuellt i sidans
vanliga innehållsflöde.

## Lägg till assistenten på en sida

1. Öppna sidan i Sitevisions redigeringsläge.
2. Lägg till webbappsmodulen **Corner assistant**.
3. Öppna modulens inställningar.
4. Fyll i minst **Assistentens ID** och **Applikation**.
5. Anpassa presentation, rubriker och övriga funktioner efter behov.
6. Spara inställningarna.
7. Öppna sidan i förhandsgranskningsläge och skicka en testfråga.
8. Publicera sidan och kontrollera även den publicerade versionen.

I Sitevisions redigeringsläge visas bara en förenklad representation av
assistenten. Den interaktiva chatten laddas först utanför redigeringsläget och
ska därför testas i förhandsgranskning eller på den publicerade sidan.

## Inställningar

### Grundinställningar

- **Assistentens ID**: identifierar vilken assistent proxyn ska använda. Värdet
  ska matcha proxykonfigurationen exakt.
- **Gruppchatt**: aktivera endast om den valda assistenten och proxyn är
  konfigurerade för gruppchatt.
- **Applikation**: applikationsnamnet som proxyn förväntar sig. Även detta
  värde måste matcha exakt.

Var särskilt uppmärksam på stora och små bokstäver, bindestreck och
mellanslag. Kopiera helst värdena från administratören i stället för att skriva
dem manuellt.

Under **Avancerat** finns följande val:

- **Behåll session vid navigering** bevarar konversationen när besökaren
  navigerar mellan sidor där assistenten används.
- **Sessionsnamn** skiljer olika sparade konversationer åt. Använd samma namn
  där samma konversation ska fortsätta och olika namn för assistenter som ska
  hållas isär.
- **Tillåt att assistenten öppnas i fullskärmsläge** visar möjligheten att växla
  till fullskärm.
- **Visa tidigare frågor** visar besökarens tidigare frågor när funktionen
  stöds av den valda konversationsversionen och proxyn.
- **Visa referenser** visar de källor som följer med assistentens svar.

### Assistent-information

Här ställer du in hur assistenten presenteras:

- **Namn**, **Titel** och **Beskrivning**,
- **Avatar**,
- **Initialer**, som används om avatarbild saknas,
- **Bakgrundsfärg, avatar**,
- **Visa namn i chattflöde**.

Skriv en kort beskrivning som tydligt förklarar vad assistenten kan hjälpa till
med. Om en avatar används bör bilden vara tydlig även i litet format.

### Användarinformation

Här ställer du in hur besökaren presenteras i chatten: namn, avatar, initialer,
avatarfärg och om namnet ska visas. Detta är presentationsinställningar. Om den
inloggade användarens faktiska namn skickas till proxyn styrs i stället av den
globala inställningen **Skicka med användarnamn**.

### Systemanvändarinformation

Systemanvändaren används bland annat för felmeddelanden. Välj antingen:

- **Visa som Assistent** för att använda assistentens utseende, eller
- **Ställ in** för att ange eget namn, avatar, initialer, avatarfärg och
  visning av namn.

### Sidhuvud

Välj om sidhuvudet ska använda assistentens namn och titel eller egna värden.
Vid **Använd egen** kan du ange **Rubrik** och **Underrubrik**. Håll rubriken
kort så att den även fungerar på små skärmar.

### Fördefinierade frågor

Aktivera **Använd fördefinierade frågor** om besökaren ska få klickbara
frågeförslag när chatten öppnas.

1. Ange en kort rubrik för förslagen.
2. Välj mellan en och fem frågor.
3. Fyll i motsvarande frågefält.
4. Testa varje fråga mot assistenten innan sidan publiceras.

Använd vanliga, konkreta frågor som hjälper besökaren att förstå assistentens
område. Undvik frågor som assistenten inte är avsedd eller behörig att besvara.

### Läs mer-länk

Ange **Länktext** och **Länk (url)** för att visa en kompletterande länk i
assistenten. Om länktexten lämnas tom används URL:en som text. En beskrivande
länktext är därför att föredra. Kontrollera länken efter publicering.

### CSS

Fältet **CSS** kan anpassa just den här modulinstansen. Det bör bara användas
av någon som känner till webbappens struktur och webbplatsens grafiska profil.
Felaktig CSS kan göra chatten svår att använda eller dölja viktiga funktioner.
Global CSS och modulens CSS används tillsammans.

## Använd metadata

Många modulinställningar kan hämta sitt värde från den aktuella sidans
metadata. Det är användbart när samma modul ligger i en mall eller används på
många sidor med olika assistent, rubrik eller innehåll.

1. Aktivera **Använd metadata** vid fältet.
2. Välj den metadata som ska styra värdet.
3. Kontrollera att metadata har rätt typ och ett giltigt värde på varje sida.
4. Testa både en sida med metadata och en sida där värdet saknas.

När **Använd metadata** är aktiverat används metadatavärdet i stället för det
manuella värdet. Om metadata saknas, är tomt eller inte kan tolkas blir fältet
tomt eller funktionen avstängd; det manuella värdet används inte som reserv.
För val som styr färg måste metadatavärdet vara ett av de värden som modulen
stöder.

Vanliga booleska metadatavärden som kan tolkas är exempelvis `true`/`false`,
`1`/`0`, `ja`/`nej` och `on`/`off`.

## Globala inställningar

De globala inställningarna gäller alla instanser av webbappen i den aktuella
Sitevision-miljön och hanteras normalt av en administratör.

### Anslutning och beteende

- **Url till AI-server** ska vara basadressen till organisationens proxy, inte
  adressen till den bakomliggande AI-tjänsten.
- **Använd conversation version 2** väljer proxy-/konversationsprotokoll och
  måste stämma med den version som miljön stöder.
- **Strömma svar** visar svaret medan det genereras, om proxyn stöder detta.
- **Kör i shadow dom** isolerar webbappens stilar från webbplatsens övriga CSS.
- **Skicka med användarnamn** skickar den inloggade Sitevision-användarens namn
  i anropet. Aktivera bara detta när det är avsett och hanteringen är förankrad
  ur integritets- och informationssäkerhetsperspektiv.

Ändra inte de avancerade anslutningsvalen utan att samordna med den som
förvaltar proxyn.

### Gemensamt utseende

Administratören kan också ställa in:

- färger för sidhuvud, knappar och frågebubblor,
- standard- och rubriktypsnitt samt basfontstorlek,
- ljust, mörkt eller systemstyrt färgläge,
- brytpunkt för små skärmar,
- avstånd från fönstrets kanter,
- global CSS.

Placeringen påverkar alla sidor där webbappen används. Kontrollera att
chattknappen inte täcker cookieknappar, tillgänglighetsverktyg, formulärknappar
eller annan fast placerad funktionalitet.

## Kontroll före publicering

Kontrollera i både smal och bred vy att:

- chattknappen syns och inte täcker andra viktiga funktioner,
- rätt namn, titel, beskrivning och avatar visas,
- en testfråga ger svar från rätt assistent,
- fördefinierade frågor fungerar,
- referenser och Läs mer-länk leder rätt,
- fullskärmsläget fungerar om det är aktiverat,
- konversationen bevaras eller nollställs enligt vald sessionsinställning,
- färger, fokusmarkeringar och text har tillräcklig kontrast,
- resultatet är korrekt även på en sida där metadata saknas.

## Felsökning

### Assistenten syns bara som en förenklad förhandsvisning

Det är normalt i Sitevisions redigeringsläge. Öppna sidan i
förhandsgranskningsläge eller publicera den för att prova den interaktiva
chatten.

### Assistenten visas inte alls

- Kontrollera att modulen är tillagd, sparad och att sidan är publicerad.
- Kontrollera att du tittar på rätt sida och rätt Sitevision-miljö.
- Prova förhandsgranskning eller den publicerade sidan, inte bara
  redigeringsläget.
- Kontrollera om chattknappen ligger bakom eller utanför sidan på grund av
  global placering eller egen CSS.
- Kontrollera webbläsarens konsol efter JavaScript-fel.

### Assistenten visas men svarar inte

- Kontrollera att **Assistentens ID** och **Applikation** exakt matchar
  konfigurationen i proxyn.
- Kontrollera den globala **Url till AI-server** i den aktuella miljön.
- Kontrollera att vald konversationsversion, gruppchatt och strömning stöds av
  proxyn.
- Om metadata används, kontrollera det faktiska metadatavärdet på sidan.
- Öppna webbläsarens utvecklarverktyg och kontrollera flikarna **Console** och
  **Network**. Notera statuskod, anropsadress och felmeddelande.

### CORS-fel eller blockerat anrop till proxyn

Vanliga tecken är fel som innehåller `CORS`, `blocked by CORS policy` eller
`Access-Control-Allow-Origin`.

1. Ta fram sidans exakta origin: protokoll, värdnamn och eventuell port, till
   exempel `https://www.exempel.se` eller `https://test.exempel.se:8443`.
   Sökväg och avslutande snedstreck ska inte ingå.
2. Be proxyadministratören kontrollera att denna origin är tillåten som
   **Host/Värd** i proxyn.
3. Tänk på att redigering, förhandsgranskning, test och produktion kan använda
   olika domäner och därför kan behöva registreras var för sig.
4. Kontrollera att **Url till AI-server** pekar på rätt proxy för just den
   Sitevision-miljön.
5. Ladda om utan cache eller prova i ett privat webbläsarfönster efter en
   ändring.

Tillåt bara kända Sitevision-domäner i proxyn. Använd inte `*` som generell
CORS-lösning.

### Fel assistent eller fel innehåll visas

- Kontrollera **Assistentens ID**, **Applikation** och **Gruppchatt**.
- Kontrollera sidans metadata om **Använd metadata** är aktiverat.
- Kontrollera **Sessionsnamn**. Olika assistenter bör inte dela sessionsnamn om
  deras konversationer ska hållas isär.
- Starta en ny konversation eller rensa den sparade sessionen om en tidigare
  session fortfarande visas.

### Konversationen följer inte med mellan sidor

- Aktivera **Behåll session vid navigering** på alla berörda modulinstanser.
- Använd samma **Sessionsnamn** på de sidor som ska dela konversation.
- Kontrollera att assistent-ID och applikation är desamma där samtalet ska
  fortsätta.
- Kontrollera att webbläsaren tillåter den lagring som webbappen använder.

### Referenser, historik eller fullskärm saknas

- Kontrollera att respektive modulinställning är aktiverad.
- Kontrollera om metadata styr inställningen till avstängd eller saknar värde.
- Säkerställ att vald konversationsversion och proxy stöder funktionen.
- För fullskärm: kontrollera även att knapp eller panel inte döljs av egen CSS.

### Utseendet är fel eller knappen täcker annat innehåll

- Kontrollera de globala inställningarna för placering, brytpunkt och färgläge.
- Kontrollera både global CSS och modulens CSS.
- Prova sidan i mobil, surfplatta och desktopbredd.
- Om **Kör i shadow dom** nyligen har ändrats kan befintlig CSS behöva
  anpassas.

### Ändringar syns inte

- Spara modulinställningen och publicera sidan på nytt.
- Globala ändringar kan kräva att sidan laddas om utan cache.
- Kontrollera att du ändrar samma Sitevision-miljö som du testar.
- Kontrollera metadata; när metadata är aktiverat påverkar det manuella värdet
  inte resultatet.

### Underlag till administratör eller support

Skicka med följande för att förenkla felsökningen:

- sidans URL och exakta origin,
- Sitevision-miljö (utveckling, test eller produktion),
- tidpunkt för testet,
- Assistentens ID, Applikation och Sessionsnamn, men inga hemligheter,
- om metadata, gruppchatt, historik, strömning och konversationsversion används,
- statuskod och hela felmeddelandet från Console/Network,
- gärna en skärmbild som inte innehåller känsliga uppgifter.
