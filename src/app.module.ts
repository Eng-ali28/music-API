import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PrismaModule from 'prisma/prisma.module';
import AuthModule from './modules/auth/auth.module';
import FavoriteModule from './modules/favorite/favorite.module';
import MusicianModule from './modules/musician/musician.module';
import PlaylistModule from './modules/playlist/playlist.module';
import ProfileModule from './modules/profile/profile.module';
import SingerModule from './modules/singer/singer.module';
import SongModule from './modules/song/song.module';
import UserModule from './modules/user/user.module';
import MusicModule from './modules/music/music.module';
import SingerAlbumModule from './modules/singer-album/singer-album.module';
import MusicianAlbumModule from './modules/musician-album/musician-album.module';
import { MailerModule } from '@nestjs-modules/mailer';
import appConfig from './config/app.config';
import MailModule from './shared/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    ProfileModule,
    MusicianModule,
    PlaylistModule,
    FavoriteModule,
    UserModule,
    SongModule,
    SingerModule,
    MusicModule,
    SingerAlbumModule,
    MusicianAlbumModule,
    MailModule,
  ],
})
class AppModule {}
export default AppModule;
