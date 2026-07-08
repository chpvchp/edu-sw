list_replace_basic = [
    (r"^Câu (\d+).", r"**Câu \1:**"),
    (r"^([A-D])\.", r"**\1.**"),
    (r"^(\([a-z]\))", r"*\1*"),
    (r"(\(\d+\))", r"*\1*"),
    (r"^(\d+\))", r"*\1*"),
    (r"^([a-z]\))", r"\1"),
    
    (r"(\d+)[,](\d+)", r"\1.\2"),
    (r"(\d+)[.](\d+)%", r"\1.\2\%"),
    (r"(\d+)%", r"$\1\%$"),
]

list_unit = [
    (r" (\d+) mL ", r" $\1\, \\mathrm{mL}$ "),
    (r" (\d+) ml ", r" $\1\, \\mathrm{ml}$ "),
    (r" (\d+) Lít ", r" $\1\, \\text{Lít}$ "),
    (r" (\d+) g ", r" $\1\, \\mathrm{g}$ "),
    (r" (\d+) gam ", r" $\1\, \\mathrm{gam}$ "),
    (r" (\d+) kg ", r" $\1\, \\mathrm{kg}$ "),
    (r" (\d+) tấn ", r" $\1\, \\text{tấn}$ "),
    
    (r"(\d+)°", r"$\1^{\\circ}$"),
    
    
    (r" (\d+)[.](\d+) mL ", r" $\1.\2\, \\mathrm{mL}$ "),
    (r" (\d+)[.](\d+) ml ", r" $\1.\2\, \\mathrm{ml}$ "),
    (r" (\d+)[.](\d+) g ", r" $\1.\2\, \\mathrm{g}$ "),
    (r" (\d+)[.](\d+) gam ", r" $\1.\2\, \\mathrm{gam}$ "),
    (r" (\d+)[.](\d+) kg ", r" $\1.\2\, \\mathrm{kg}$ "),
]

list_replace_chemistry_carbohydrate = [
    (r"Carbohydrate", r"*Carbohydrate*"),
    (r"carbohydrate", r"*carbohydrate*"),
    
    (r"Glucose", r"*Glucose*"),
    (r"glucose", r"*glucose*"),
    (r"Fructose", r"*Fructose*"),
    (r"fructose", r"*fructose*"),
    (r"Saccharose", r"*Saccharose*"),
    (r"saccharose", r"*saccharose*"),
    (r"Maltose", r"*Maltose*"),
    (r"maltose", r"*maltose*"),
    (r"Tinh bột", r"*Tinh bột*"),
    (r"tinh bột", r"*tinh bột*"),
    (r"Cellulose", r"*Cellulose*"),
    (r"cellulose", r"*cellulose*"),
    
    (r"disaccharide", r"*disaccharide*"),
    (r"polysaccharide", r"*polysaccharide*"),
    
    (r"Glycogen", r"*Glycogen*"),
    (r"glycogen", r"*glycogen*"),
    
    (r"β-glucose", r"*$\\beta$-glucose*"),
    (r"α-glucose", r"*$\\alpha$-glucose*"),
    
    (r"β-1,4-glycoside", r"*$\\beta$-1,4-glycoside*"),
    (r"α-1,4-glycoside", r"*$\\alpha$-1,4-glycoside*"),
    (r"β-1,6-glycoside", r"*$\\beta$-1,6-glycoside*"),
    (r"α-1,6-glycoside", r"*$\\alpha$-1,6-glycoside*"),
    
    (r"α-amylase", r"*$\\alpha$-amylase*"),
]

list_replace_chemistry_inorganic = [
    # Acid
    (r"Acid", r"*Acid*"),
    (r"acid", r"*acid*"),
    (r"H₂SO₄", r"$\\mathrm{H}_{2}\\mathrm{SO}_{4}$"),
    
    # Base
    (r"-OH", r"$\\mathrm{-OH}$"),
    (r"NaOH", r"$\\mathrm{NaOH}$"),
    (r"Cu(OH)2", r"\\mathrm{Cu(OH)}_{2}"),
    
    (r"NaHCO₃", r"$\\mathrm{NaHCO}_{3}$"),
    (r"AgNO₃/NH₃", r"$\\mathrm{AgNO}_{3}/\\mathrm{NH}_{3}$"),
    (r"AgNO₃", r"$\\mathrm{AgNO}_{3}$"),
    (r"NH₃", r"$\\mathrm{NH}_{3}$"),
    
    (r"Schweizer", r"*Schweizer*"),
    
    (r"Br2", r"$\\mathrm{Br}_{2}$"),
    (r"I₂", r"$\\mathrm{I}_{2}$"),
    
    (r"carbon dioxide", r"*carbon dioxide*")
]

list_replace_chemistry_other = [
    (r"Polymer", r"*Polymer*"),
    (r"polymer", r"*polymer*"),
    
    (r"Enzyme", r"*Enzyme*"),
    (r"enzyme", r"*enzyme*"),
    
    (r"Amylopectin", r"*Amylopectin*"),
    (r"amylopectin", r"*amylopectin*"),
    
    (r"amylose", r"*amylose*"),
    
    
    (r"Tollens", r"*Tollens*"),
    (r"tollens", r"*tollens*"),
    
    (r"iodine", r"*iodine*"),
    
    (r"ethanol", r"*ethanol*"),
]

list_all = list_replace_basic + list_unit + list_replace_chemistry_carbohydrate + list_replace_chemistry_inorganic + list_replace_chemistry_other