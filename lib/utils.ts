
export const getTeamFlagUrl = (teamName: string, teamLogoUrl?: string | null) => {
    if (teamLogoUrl) return teamLogoUrl;

    // Normalize: lowercase, remove accents, replace spaces with hyphens
    const normalized = teamName.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

    // Special mappings for file names that don't match the standard normalization
    const mappings: Record<string, string> = {
        'paises-bajos': 'netherlands',
        'arabia-saudi': 'arabia-saudita',
        'republica-de-corea': 'korea-del-sur',
        'corea-del-sur': 'korea-del-sur',
        'republica-islamica-de-iran': 'iran',
        'cabo-verde': 'cape-verde',
        'argelia': 'algeria',
        'uzbekistan': 'uzbequistan',
        'curazao': 'curacao',
        'espana': 'espana', // Just to be sure about ñ handling
        'tunez': 'tunez',
        'mexico': 'mexico',
        'japon': 'japon',
        'belgica': 'belgica',
        'sudafrica': 'sudafrica',
        'canada': 'canada',
        'panama': 'panama',
        'haiti': 'haiti',
        'marruecos': 'marruecos',
        'croacia': 'croacia',
        'suiza': 'suiza',
        'escocia': 'escocia',
        'hungria': 'hungary', // If exists
    };

    const finalName = mappings[normalized] || normalized;
    return `/banderas/${finalName}.png`;
};
