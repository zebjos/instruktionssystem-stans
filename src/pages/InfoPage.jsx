import React from "react";
import {
  Info,
  Image,
  Upload,
  FileText,
  CircleCheck,
  CircleAlert,
  CircleX,
  HelpCircleIcon,
  Smartphone,
} from "lucide-react";
import "./InfoPage.css";
import { EditIcon } from "lucide-react";

function InfoPage() {
  return (
    <div className="info-page">
      <h2><Info size={20} /> Instruktionssystem – Information</h2>

      <p>
        Det här systemet används för att visa instruktioner för hur detaljer ska hängas och packas i samband med lackering.
        Sök på ett artikelnummer för att få upp instruktioner i form av kommentarer och bilder.
      </p>

      <h3><HelpCircleIcon size={18} /> Saknas artikel i systemet?</h3>
      <p>
        Om du söker efter ett artikelnummer och inte hittar det i systemet kan du själv lägga till artikeln genom att gå till <strong>Lägg till artikel</strong> i menyn. 
        Där fyller du i artikelnummer och väljer vilken kund den tillhör.
      </p>
      <p>
        När artikeln är tillagd kan du sedan lägga in instruktioner genom kommentarer eller att spara bilder eller videor i rätt mapp, enligt beskrivningarna nedan.
      </p>

      <h3><FileText size={18} /> Kommentarer</h3>
      <p>
        Kommentarerna kan skrivas och redigeras genom att klicka på <EditIcon size={16} style={{ display: "inline", verticalAlign: "middle" }} /> uppe i högra hörnet på kommentarsfältet efter att du har sökt efter ett artikelnummer som finns i databasen.
      </p>

      <h3><Smartphone size={18} /> Ladda upp media från mobil eller dator</h3>
      <p>
        Du kan enkelt ladda upp bilder och videor direkt från mobilen via fliken <strong>Ladda upp</strong> i menyn. Där väljer du kund, artikelnummer, typ (hängning/packning), samt fil att ladda upp.
      </p>
      <ul>
        <li>Filer i HEIC eller MOV/HEVC konverteras automatiskt till .jpg eller .mp4.</li>
        <li>Media hamnar direkt i rätt mapp på företagets nätverksdisk.</li>
        <li>Visningsordning hanteras automatiskt baseras på ordningen som uppladdningen har skett.</li>
      </ul>

      <h3><Upload size={18} /> Manuellt – Spara filer på nätverksenhet</h3>
      <p>
        Bilder och videor kan även sparas direkt på företagets server enligt följande struktur:
      </p>

      <pre className="info-code">
        /Gemensam/&#123;kund&#125;/bilder/hängning/&#123;artikelnummer&#125;_&#123;ordnings siffra&#125;.jpg<br />
        /Gemensam/&#123;kund&#125;/bilder/packning/&#123;artikelnummer&#125;_&#123;ordnings siffra&#125;.png<br />
        <br />
        Exempel:<br />
        /Gemensam/Instant Systems/bilder/hängning/1026-0612_1.mp4
      </pre>

      <ul>
        <li>Filer måste börja med artikelnumret (exakt match).</li>
        <li>Använd <strong>_1, _2, _3</strong> i slutet av filnamnet för att ange visningsordning.</li>
        <li>Format: <code>.jpg</code>, <code>.png</code>, <code>.mp4</code>.</li>
        <li>Bilder och videor sorteras automatiskt efter suffix.</li>
      </ul>

      <h3><Image size={18} /> Symboler för media</h3>
      <ul className="media-symbols">
        <li>🟢 = Både hängning och packning har mediafiler</li>
        <li>🟠 = Endast en av dem har media</li>
        <li>🔴 = Ingen media hittades för artikeln</li>
      </ul>
    </div>
  );
}

export default InfoPage;