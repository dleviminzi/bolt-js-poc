const { App } = require('@slack/bolt');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

app.message('hello', async({message, say}) => {
    await say(`Hey there <@${message.user}>!`);
    console.log('hi');
});

app.shortcut('example', async({shortcut, body, ack, client, logger}) => {
    try {
        await ack();

        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                // View identifier
                callback_id: 'view_1',
                title: {
                  type: 'plain_text',
                  text: 'Modal title'
                },
            blocks: [
              {
                type: 'input',
                block_id: 'input_c',
                label: {
                  type: 'plain_text',
                  text: 'What are your hopes and dreams?'
                },
                element: {
                  type: 'plain_text_input',
                  action_id: 'dreamy_input',
                  multiline: true
                }
              }
            ],
            submit: {
              type: 'plain_text',
              text: 'Submit'
            }
          }
        });

    logger.info(result);
    }
    catch(error) {
        logger.error(error);
    }
});

app.view('view_1', async({ack, body, view, client, logger }) => {
    await ack();

    const val = view['state']['values']['input_c']['dreamy_input']['value'];
    const user = body['user']['id'];

    console.log(val);

    try {
    await client.chat.postMessage({
      channel: user,
      text: val
        });
      }
      catch (error) {
        logger.error(error);
      }

});

(async () => {
    await app.start();

    console.log('⚡️ app running!');
})();

