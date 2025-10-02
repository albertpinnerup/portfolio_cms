import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutBanner extends Struct.ComponentSchema {
    collectionName: 'components_layout_banners';
    info: {
        displayName: 'banner';
    };
    attributes: {
        description: Schema.Attribute.Text;
        isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
        link: Schema.Attribute.Component<'shared.link', false>;
    };
}

export interface LayoutFooter extends Struct.ComponentSchema {
    collectionName: 'components_layout_footers';
    info: {
        displayName: 'Footer';
    };
    attributes: {
        Logo: Schema.Attribute.Component<'shared.logo-link', false>;
        navItems: Schema.Attribute.Component<'shared.link', true>;
        socialLinks: Schema.Attribute.Component<'shared.logo-link', true>;
        text: Schema.Attribute.Text;
    };
}

export interface LayoutHeader extends Struct.ComponentSchema {
    collectionName: 'components_layout_headers';
    info: {
        displayName: 'Header';
    };
    attributes: {
        CTA: Schema.Attribute.Component<'shared.link', false>;
        logo: Schema.Attribute.Component<'shared.logo-link', false>;
        navItems: Schema.Attribute.Component<'shared.link', true>;
    };
}

export interface LayoutHero extends Struct.ComponentSchema {
    collectionName: 'components_layout_heroes';
    info: {
        displayName: 'Hero';
    };
    attributes: {
        description: Schema.Attribute.Text;
        name: Schema.Attribute.String;
        technologies: Schema.Attribute.Component<'shared.technologies', true>;
    };
}

export interface SharedLink extends Struct.ComponentSchema {
    collectionName: 'components_shared_links';
    info: {
        displayName: 'Link';
    };
    attributes: {
        href: Schema.Attribute.String;
        isButtonLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
        isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
        label: Schema.Attribute.String;
        type: Schema.Attribute.Enumeration<['PRIMARY', 'SECONDARY']>;
    };
}

export interface SharedLogoLink extends Struct.ComponentSchema {
    collectionName: 'components_shared_logo_links';
    info: {
        displayName: 'Logo Link';
    };
    attributes: {
        href: Schema.Attribute.String;
        image: Schema.Attribute.Media<'images'>;
        isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
        label: Schema.Attribute.String;
    };
}

export interface SharedTechnologies extends Struct.ComponentSchema {
    collectionName: 'components_shared_technologies';
    info: {
        displayName: 'Technologies';
    };
    attributes: {
        title: Schema.Attribute.String;
    };
}

declare module '@strapi/strapi' {
    export module Public {
        export interface ComponentSchemas {
            'layout.banner': LayoutBanner;
            'layout.footer': LayoutFooter;
            'layout.header': LayoutHeader;
            'layout.hero': LayoutHero;
            'shared.link': SharedLink;
            'shared.logo-link': SharedLogoLink;
            'shared.technologies': SharedTechnologies;
        }
    }
}
