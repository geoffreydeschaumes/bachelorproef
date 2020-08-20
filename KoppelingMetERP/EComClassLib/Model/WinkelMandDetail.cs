using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EComClassLib.Model
{
    public class WinkelMandDetail
    {
        public Artikel Artikel { get; set; }
        public decimal Hoeveelheid { get; set; }
        public WinkelMandDetail() { 
        }
    }
}