using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EComClassLib.Model
{
    public class Klant
    {
        public int AantalResultatenInGrid { get; set; }
        public int GridMode { get; set; }
        public string Naam { get; set; }
        public string Obj { get; set; }
        public bool Particulier { get; set; }
        public bool PrijzenInclusiefBTW { get; set; }
        public bool Prospect { get; set; }
       // public Taal Taal { get; set; }
        public Klant() { }
    }
}