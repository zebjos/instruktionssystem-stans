import React from "react";
import {
  Info,
  Image,
  FileText,
  HelpCircleIcon,
  Smartphone,
  NotepadTextDashed,
  Upload,
} from "lucide-react";
import "./InfoPage.css";
import { EditIcon } from "lucide-react";
import StatusDot from "../utils/StatusDot";

function InfoPageStans() {
  return (
    <div className="info-page">
      <h2><Info size={20} /> Instruktionssystem – Stans</h2>

      <p>
        Det här systemet används för att visa och hantera instruktioner för hur detaljer ska hanteras vid 
        <strong> stansning</strong> och <strong>packning</strong>. 
        Du söker fram en artikel via artikelnummer och kan där se instruktioner i form av kommentarer, bilder och videor.
      </p>

      <h3><HelpCircleIcon size={18} /> Saknas artikel i systemet?</h3>
      <p>
        Om du söker efter ett artikelnummer och inte hittar det i systemet kan du själv lägga till artikeln via 
        <strong> Lägg till artikel</strong> i menyn. Där fyller du i artikelnummer och väljer vilken kund den tillhör.
      </p>

      <p>
        När artikeln är skapad navigeras du automatiskt till den, där kan du lägga till instruktioner, både genom kommentarer 
        och genom att ladda upp bilder eller videor i sektionerna <strong>Stansning</strong> och <strong>Packning</strong>.
      </p>

      <h3><FileText size={18} /> Kommentarer</h3>
      <p>
        Kommentarerna kan skrivas och redigeras genom att klicka på 
        {" "}<EditIcon size={16} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
        i högra hörnet på respektive sektion. Du kan även ange ditt namn för att se vem som skapade 
        eller ändrade instruktionen.
      </p>

      <h3><Upload size={18} /> Ladda upp bilder och videor</h3>
      <p>
        Uppladdning sker nu direkt på artikelsidan under respektive sektion (<strong>Stansning</strong> / <strong>Packning</strong>). 
        Tryck på knappen <em>Ladda upp</em> för att välja bilder eller videor från mobil, iPad eller dator.
      </p>
      <ul>
        <li>Filer i <code>HEIC</code> eller <code>MOV/HEVC</code> konverteras automatiskt till <code>.jpg</code> eller <code>.mp4</code>.</li>
        <li>Media sparas direkt i rätt kundmapp på nätverksdisken.</li>
        <li>Du får en bekräftelse när uppladdningen är klar.</li>
      </ul>

      <h3><NotepadTextDashed size={18} /> Standardmall</h3>
      <p>
        Du kan söka efter <strong>MALL</strong> för att se hur instruktionerna ska struktureras, 
        och <strong>MALL_IFYLLD</strong> för ett exempel på en färdig instruktion med bilder.
      </p>

      <h3><Image size={18} /> Symboler för media i lista</h3>
      <ul className="media-symbols">
        <li><StatusDot color="green" filled={true} /> = Både stansning och packning har mediafiler</li>
        <li><StatusDot color="orange" filled={true} /> = Endast en av dem har media</li>
        <li><StatusDot color="red" filled={true} /> = Ingen media hittades för artikeln</li>
      </ul>

      <h3><Smartphone size={18} /> Tips</h3>
      <p>Systemet fungerar lika bra på iPad, mobil och dator.</p>
    </div>
  );
}

export default InfoPageStans;