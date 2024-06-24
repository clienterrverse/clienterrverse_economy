import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

const magikCommand = {
    data: new SlashCommandBuilder()
        .setName('magik')
        .setDescription('Create a magik image')
        .addUserOption(option => option.setName('target').setDescription('User to magik').setRequired(false))
        .setDMPermission(false),

    run: async (client, interaction) => {
        try {
            await interaction.deferReply();

            // Get the target user, defaulting to the command user if no target is specified
            const targetUser = interaction.options.getUser('target') || interaction.user;

            // Get the user's avatar URL
            const avatarURL = targetUser.displayAvatarURL({ size: 512, extension: 'jpg', forceStatic: true });

            // Fetch the magik image
            const response = await fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${encodeURIComponent(avatarURL)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const data = await response.json();

            // Check if the API request was successful
            if (!data || !data.message) {
                throw new Error('Failed to generate magik image.');
            }
            const magikImageURL = await data.message;

            const embed = new EmbedBuilder()
            .setTitle('Magik')
            .setColor('#FF0000')  // Set a custom color for the embed (optional)
            .setImage(magikImageURL)
            .setURL(magikImageURL) // Set the URL of the embed (optional)
            .setDescription(`Magik'd image of ${targetUser.username}`); // Description of the embed
        
        // Add fields correctly using objects
        embed.addFields(
            { name: 'Requested by', value: interaction.user.username, inline: true },
            { name: 'Generated Image', value: `[Open Image](${magikImageURL})`, inline: true }
        );
        

            // Send the embed message as a reply
            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error generating magik image:', error);
            // If deferReply failed, use followUp instead of editReply
            if (interaction.deferred) {
                await interaction.editReply('Sorry, something went wrong while generating the magik image.');
            } else {
                await interaction.reply('Sorry, something went wrong while generating the magik image.');
            }
        }
    },
};

export default magikCommand;