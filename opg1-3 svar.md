Eksamen

Oppgave 1 utvikling

Jeg valgte å fokusere mest på å få siden til å fungere, den er ikke så vannskelig å starte nå etter å ha lagd ting om til en docker container. Dette gjør det til at vi må bare installere postgress, docker desktop og npm, men dette er også kommandoer som kan bli lagt til i en dokcer compose som hjelper med å gjør det enklere for alle å sette opp og å forstå hvordan alt fungurer. 
Oppgave 2 Drift

Her var hvor jeg konverterte webserveren og databasene over til en docker fil som jeg kunne kjøre lokalt fordi jeg hadde ikke tid til å sette opp alt sammen på en egen server som for eksempel en supabase database, jeg bare følgte instruksjonene som føltes riktig. Dette er jo bare en nesten demo av hvordan en server.js kan blir gjordt om til en docker container, men hvis dette var satt opp på servere kunne vi ha satt databsene opp på 2 forskjelige serverer fordi dette hjelper oss med tilfelle hvis en server går ned så har vi fortsatt en som fungerer og ikke alt sammen i hele bygget går ned på samme tid. 


Oppgave 3 GDPR

Når vi tenker på GDPR så tenker vi sterkt på personvern og hva vi gjør med dataene våres, da er det viktig at det vi lager er veldig gjennomsiktig med hva vi gjør. På grunn av denne siden skal vise produkter kunder kan kjøpe er det 2 forskjellige måter det kan gå, shopping på nett, eller om det er i buttiken. 
En viktig ting å altid nevne da fordi dette skal være en buttik på nettet må vi passe på at kundene vet at datene sine blir lagret, og hvor de blit lagret og har retten til å si nei. Vi trenger bare det nøvendinge som epost navn og ordere.
Men selve oppgaven tar da og sier til oss at vi skal ha en enkel veiledning til hvordan forskjellige kunder og ansatte kan logge seg på og registrere seg til å hnadle. Da må vi lagre datane i en sikker plass, for det som blir lagret er da:
-	Navn
-	Epost
-	Mobil (hvis de vil)
-	Alder (også valgfritt)

Men fordi vi skal ha en plass for dem å kjøpe ting også, da må vi sikre ting som kort, og betalingsdetlajer blir lagret på en sikekr måte. Det samme må vi gjør med passord, vi må ha en krypteringsmetode som at ikke alt står i klarttekst. Da kan vi for eksempel bruke bcrypt. Og da hvis vi får en lekasje med passord epost og navn må det meldes inn til datatilsynet inneom 72 timer.
Vi kan også ha tredjeparti til å hjelpe med for eksempel betaling, da har vi en avtale med disse tredjepartiene om datalagringen. Og da hvis noen har lyst til å si seg opp og slette kontoen sin og alt av dataen har de rett til det.

Så vi ville behnadlet denne dataen med å kryptere alt av, navn, epost som ingen kan ta og stjele den uten å må dekryptere det. Serverene og databasene skal også ha en høy sikkerhet, som at sjansen for at noen får tilgang er liten. Vi skal bare lagre det som er nødvendig og ha intensjonene våre klare med hva vi skal gjør med dataene, de skal også da lagres i  EU og ikke andre land. Med betaling skal vi ha en avtale med tredjeparti som akn ta hånd om den viktige infoen med bank og betaling. 
Vi skal også ha protokoller for hva og gjør under en datalekasje, som hvis neo går galt er vi klare.
Med registrering skal vi ha det satt opp som at du setter inn din epost og lager et passord, og hvis du vil legge inn et mobilnummer som 2fa. (2FA er da noe man bruekr til å verefisere med noe eksternt før vi logger in, så selv om noen får passordet trenger de mobilen, mail eller en authenticator app.) dette legger et ekstra sikkerhet på kontoen dems. 

 
Registreing veiledning:
-	Trykk på registrer deg selv
-	Skriv inn ditt passord og epost, mobil hvis du vil ha ekstra besyktelse.
-	Etter det får du en velkommen epost/mobil fra vårt selskap
-	Derreter blir du tatt til en liste av produkter 
-	Der velger de du vil ha, så blir de lagt til i vognen din.
-	Velg hjemmelevering, buttikhenting eller lei et lokal.
-	Etter du har valgt din adresse, buttik eller lokal betaler du.
-	Dereter får du en mail/melding som sier «takk for din handling hos oss»
-	Da får du oppdateringer på orderen din og når du kan hente eller den har ankommet.
