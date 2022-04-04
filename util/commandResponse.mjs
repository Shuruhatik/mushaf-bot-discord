import Database from "st.db";
const saves_db = new Database({path:"./datas/saves.yml"})
const temp_db = new Database({path:"./datas/temp.yml"})
import {Client,MessageEmbed,Permissions,MessageActionRow,MessageButton} from 'discord.js';
import mushafs from './mushafs.mjs'
export default async function(client,interaction,config) {
  if(interaction.isButton()){
   if(interaction.customId.startsWith("setmushaf_")){
    let mushaf_type = mushafs[+interaction.customId.split("_")[1]]
    let randomID = Date.now().toString(36) + Math.random().toString(36).substr(2)
    let row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`${randomID}_fastback`)
          .setStyle('SECONDARY')
          .setEmoji('⏪'),
        new MessageButton()
          .setCustomId(`${randomID}_back`)
          .setStyle('SECONDARY')
          .setEmoji('◀'),
        new MessageButton()
          .setCustomId(`${randomID}_next`)
          .setStyle('SECONDARY')
          .setEmoji('▶'),
        new MessageButton()
          .setCustomId(`${randomID}_fastnext`)
          .setStyle('SECONDARY')
          .setEmoji('⏩'),
        new MessageButton()
          .setCustomId(`${randomID}_save`)
          .setStyle('SUCCESS')
          .setEmoji('✔'),
      )
    let page = await saves_db.has(`mushafpage_${interaction.customId.split("_")[1]}_${interaction.user.id}`) == true ? await saves_db.get(`mushafpage_${interaction.customId.split("_")[1]}_${interaction.user.id}`) : 1;
    let embed = new MessageEmbed()
      .setTitle(`${mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${interaction.customId.split("_")[1]}/${page}.${mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${page}/${mushaf_type.page_end}`)
     await interaction.reply({ embeds: [embed], components: [row],ephemeral:true })   
     await temp_db.set(`${randomID}`,{
       ownerId:interaction.user.id,
       page,
       mushaf_type_number:+interaction.customId.split("_")[1],
       mushaf_type
     })
   }
    if(await temp_db.has(interaction.customId.split("_")[0]) == true) {
    let temp_data = await temp_db.get(interaction.customId.split("_")[0])
    if (temp_data.ownerId != interaction.user.id) return interaction.reply({ content: `> :x: هذا ليس لك. إذا كنت تريد أن تفعل ذلك ، افعلها\n\`/mushaf\``, ephemeral: true });
    if(interaction.customId.split("_")[1] == "save"){
      await saves_db.set(`mushafpage_${temp_data.mushaf_type_number}_${interaction.user.id}`, temp_data.page)
      await interaction.reply({ content: `> ✅ ${temp_data.page} عندما تعيد استخدام الأمر الآن بنفس نوع المصحف الحالي ، ستجد الصفحة المحفوظة ، التي حفظت رقم\n\`/mushaf\``, ephemeral: true });
    }
    if(interaction.customId.split("_")[1] == "next"){
      if (temp_data.page + 1 > temp_data.mushaf_type.page_end) return interaction.reply({ content: `> :x: لقد وصلت إلى الحد الأقصى من الصفحات`, ephemeral: true });
      temp_data.page = temp_data.page+1
      let embed = new MessageEmbed()
      .setTitle(`${temp_data.mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${temp_data.mushaf_type_number}/${temp_data.page}.${temp_data.mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${temp_data.page}/${temp_data.mushaf_type.page_end}`)
      await temp_db.set(interaction.customId.split("_")[0],temp_data)
      await interaction.update({ embeds: [embed] });
    }
    if(interaction.customId.split("_")[1] == "back"){
      if (temp_data.page - 1 < 1) return interaction.reply({ content: `> :x: لقد وصلت إلى الحد الأقصى للصفحات`, ephemeral: true });
      temp_data.page = temp_data.page-1
      let embed = new MessageEmbed()
      .setTitle(`${temp_data.mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${temp_data.mushaf_type_number}/${temp_data.page}.${temp_data.mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${temp_data.page}/${temp_data.mushaf_type.page_end}`)
      await temp_db.set(interaction.customId.split("_")[0],temp_data)
      await interaction.update({ embeds: [embed] });
    }
    if(interaction.customId.split("_")[1] == "fastback"){
      temp_data.page = 1
      let embed = new MessageEmbed()
      .setTitle(`${temp_data.mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${temp_data.mushaf_type_number}/${temp_data.page}.${temp_data.mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${temp_data.page}/${temp_data.mushaf_type.page_end}`)
      await temp_db.set(interaction.customId.split("_")[0],temp_data)
        await interaction.update({ embeds: [embed] });
    }
    if(interaction.customId.split("_")[1] == "fastnext"){
      temp_data.page = temp_data.mushaf_type.page_end
      let embed = new MessageEmbed()
      .setTitle(`${temp_data.mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${temp_data.mushaf_type_number}/${temp_data.page}.${temp_data.mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${temp_data.page}/${temp_data.mushaf_type.page_end}`)
        await temp_db.set(interaction.customId.split("_")[0],temp_data)
        await interaction.update({ embeds: [embed] });
     }
    }
  }
  if(interaction.isCommand()){
   if(interaction.commandName == "setmushaf"){
     let mushaf_type = mushafs[+interaction.options.getString("mushaf_type")]
     let randomID = Date.now().toString(36) + Math.random().toString(36).substr(2)
     if(!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) return interaction.reply({content:`:x: ليس لديك صلاحيات القيام بهذا الامر`,ephemeral:true}) 
     await interaction.reply({content:`✅ تم أرسال رسالة المصحف الثابت داخل الروم بنجاح جزاك الله كل خير`,ephemeral:true})
     let embed = new MessageEmbed()
     .setTitle(mushaf_type.name)
     .setDescription(`**يقول النبي ﷺ: اقرؤوا هذا القرآن، فإنه يأتي شفيعًا لأصحابه يوم القيامة ويقول ﷺ: من قرأ حرفًا من القرآن فله به حسنة والحسنة بعشر أمثالها وكان يومًا جالسًا في أصحابه، فقال -عليه الصلاة والسلام-: أيحب أحدكم أن يذهب إلى بطحان وادٍ في المدينة فيرجع بناقتين عظيمتين في غير إثم ولا قطيعة رحم؟ قالوا كلهم: كل واحد يحب ذلك، قال: لأن يذهب أحدكم إلى المسجد، فيعلم آيتين من كتاب الله خير له من ناقتين عظيمتين، وثلاث خير من ثلاث، وأربع خير من أربع، ومن أعدادهن من الإبل فالسنة للجميع الإكثار من قراءة القرآن للمرأة والرجل العجوز ولغير العجوز، ولو جرى بعض التحريف ما يضر، عليها أن تجتهد، وعلى الرجل أن يجتهد حتى يقيم لسانه، .**`)
     .setColor('#2f3136')
     .setImage(mushaf_type.cover)
     .setFooter(`انقر فوق الزر الموجود أسفل هذه الرسالة لفتح المصحف الخاص بك`)
     let row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`setmushaf_${interaction.options.getString("mushaf_type")}_${randomID}`)
          .setStyle('SECONDARY')
          .setEmoji('📖')
          .setLabel("فتح المصحف الخاص بك"))
     await interaction.channel.send({ embeds: [embed], components: [row] })   
   }
   if(interaction.commandName == "mushaf"){
     let mushaf_type = mushafs[+interaction.options.getString("mushaf_type")]
     let randomID = Date.now().toString(36) + Math.random().toString(36).substr(2)
    let row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`${randomID}_fastback`)
          .setStyle('SECONDARY')
          .setEmoji('⏪'),
        new MessageButton()
          .setCustomId(`${randomID}_back`)
          .setStyle('SECONDARY')
          .setEmoji('◀'),
        new MessageButton()
          .setCustomId(`${randomID}_next`)
          .setStyle('SECONDARY')
          .setEmoji('▶'),
        new MessageButton()
          .setCustomId(`${randomID}_fastnext`)
          .setStyle('SECONDARY')
          .setEmoji('⏩'),
        new MessageButton()
          .setCustomId(`${randomID}_save`)
          .setStyle('SUCCESS')
          .setEmoji('✔'),
      )
    if (interaction.options.getNumber('page') && interaction.options.getNumber('page') > mushaf_type.page_end) return interaction.reply({ content: `> :x: لقد وصلت إلى الحد الأقصى للصفحات في هذا المصحف`, ephemeral: true });
    let page = interaction.options.getNumber('page') ? interaction.options.getNumber('page') : await saves_db.has(`mushafpage_${interaction.options.getString("mushaf_type")}_${interaction.user.id}`) == true ? await saves_db.get(`mushafpage_${interaction.options.getString("mushaf_type")}_${interaction.user.id}`) : 1;
     
    let embed = new MessageEmbed()
      .setTitle(`${mushaf_type.name}`)
      .setImage(`http://www.islamicbook.ws/${interaction.options.getString("mushaf_type")}/${page}.${mushaf_type.type}`)
      .setColor('#2f3136')
      .setFooter(`Page • ${page}/${mushaf_type.page_end}`)
     await interaction.reply({ embeds: [embed], components: [row] })   
     await temp_db.set(`${randomID}`,{
       ownerId:interaction.user.id,
       page,
       mushaf_type_number:+interaction.options.getString("mushaf_type"),
       mushaf_type
     })
  }
 }
}