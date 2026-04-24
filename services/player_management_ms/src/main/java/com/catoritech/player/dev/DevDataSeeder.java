package com.catoritech.player.dev;

import com.catoritech.player.dto.AuthResponse;
import com.catoritech.player.dto.RegisterRequest;
import com.catoritech.player.model.Player;
import com.catoritech.player.service.PlayerService;
import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
@IfBuildProfile("dev")
public class DevDataSeeder {

    private static final Logger LOG = Logger.getLogger(DevDataSeeder.class);
    private static final String DEFAULT_PASSWORD = "password123";

    record SeedEntry(
            String username,
            String email,
            String name,
            String surname,
            Player.Sex sex,
            LocalDate birthday,
            boolean isAdmin,
            LocalDateTime createdAt
    ) {}

    private static final List<SeedEntry> SEED_PLAYERS = List.of(
            new SeedEntry("admin_user",      "admin@example.com",           "Admin",     "User",      Player.Sex.PREFER_NOT_TO_SAY, LocalDate.of(1980,  1,  1), true,  LocalDateTime.of(2026,  2, 20,  8,  0)),
            new SeedEntry("tom_carter",      "tom.carter@example.com",      "Tom",       "Carter",    Player.Sex.MALE,              LocalDate.of(1990,  4, 12), false, LocalDateTime.of(2026,  2, 23, 10, 15)),
            new SeedEntry("sarah_hayes",     "sarah.hayes@example.com",     "Sarah",     "Hayes",     Player.Sex.FEMALE,            LocalDate.of(1993,  8, 22), false, LocalDateTime.of(2026,  2, 25, 14, 30)),
            new SeedEntry("marcus_bell",     "marcus.bell@example.com",     "Marcus",    "Bell",      Player.Sex.MALE,              LocalDate.of(1987,  3,  5), false, LocalDateTime.of(2026,  2, 28,  9, 45)),
            new SeedEntry("priya_sharma",    "priya.sharma@example.com",    "Priya",     "Sharma",    Player.Sex.FEMALE,            LocalDate.of(1995, 11, 18), false, LocalDateTime.of(2026,  3,  2, 16, 20)),
            new SeedEntry("daniel_cox",      "daniel.cox@example.com",      "Daniel",    "Cox",       Player.Sex.MALE,              LocalDate.of(1988,  6, 30), false, LocalDateTime.of(2026,  3,  5, 11, 10)),
            new SeedEntry("natasha_reed",    "natasha.reed@example.com",    "Natasha",   "Reed",      Player.Sex.FEMALE,            LocalDate.of(1992,  2, 14), false, LocalDateTime.of(2026,  3,  5, 17, 55)),
            new SeedEntry("leon_foster",     "leon.foster@example.com",     "Leon",      "Foster",    Player.Sex.MALE,              LocalDate.of(1984,  9,  7), false, LocalDateTime.of(2026,  3,  9, 13, 40)),
            new SeedEntry("amber_price",     "amber.price@example.com",     "Amber",     "Price",     Player.Sex.FEMALE,            LocalDate.of(1998,  5, 23), false, LocalDateTime.of(2026,  3, 11,  8, 30)),
            new SeedEntry("ryan_hughes",     "ryan.hughes@example.com",     "Ryan",      "Hughes",    Player.Sex.MALE,              LocalDate.of(1991, 12,  1), false, LocalDateTime.of(2026,  3, 11, 19, 15)),
            new SeedEntry("claire_hunt",     "claire.hunt@example.com",     "Claire",    "Hunt",      Player.Sex.FEMALE,            LocalDate.of(1986,  7, 19), false, LocalDateTime.of(2026,  3, 14, 10, 50)),
            new SeedEntry("ben_ward",        "ben.ward@example.com",        "Ben",       "Ward",      Player.Sex.MALE,              LocalDate.of(1994,  1, 28), false, LocalDateTime.of(2026,  3, 16, 15, 25)),
            new SeedEntry("diana_ross",      "diana.ross@example.com",      "Diana",     "Ross",      Player.Sex.FEMALE,            LocalDate.of(1989, 10,  3), false, LocalDateTime.of(2026,  3, 16, 20, 10)),
            new SeedEntry("kevin_brooks",    "kevin.brooks@example.com",    "Kevin",     "Brooks",    Player.Sex.MALE,              LocalDate.of(1996,  4, 15), false, LocalDateTime.of(2026,  3, 18,  9,  0)),
            new SeedEntry("nina_cole",       "nina.cole@example.com",       "Nina",      "Cole",      Player.Sex.FEMALE,            LocalDate.of(1985,  8, 11), false, LocalDateTime.of(2026,  3, 20, 14, 45)),
            new SeedEntry("adam_banks",      "adam.banks@example.com",      "Adam",      "Banks",     Player.Sex.MALE,              LocalDate.of(1997,  3, 27), false, LocalDateTime.of(2026,  3, 20, 18, 30)),
            new SeedEntry("rachel_ford",     "rachel.ford@example.com",     "Rachel",    "Ford",      Player.Sex.FEMALE,            LocalDate.of(1990,  6,  8), false, LocalDateTime.of(2026,  3, 23, 11, 20)),
            new SeedEntry("luke_mason",      "luke.mason@example.com",      "Luke",      "Mason",     Player.Sex.MALE,              LocalDate.of(1983, 12, 20), false, LocalDateTime.of(2026,  3, 23, 22,  5)),
            new SeedEntry("helen_stone",     "helen.stone@example.com",     "Helen",     "Stone",     Player.Sex.FEMALE,            LocalDate.of(1999,  2,  3), false, LocalDateTime.of(2026,  3, 26,  8, 15)),
            new SeedEntry("sean_walsh",      "sean.walsh@example.com",      "Sean",      "Walsh",     Player.Sex.MALE,              LocalDate.of(1982,  7, 16), false, LocalDateTime.of(2026,  3, 28, 13,  0)),
            new SeedEntry("grace_mills",     "grace.mills@example.com",     "Grace",     "Mills",     Player.Sex.FEMALE,            LocalDate.of(1994,  5, 30), false, LocalDateTime.of(2026,  3, 28, 16, 40)),
            new SeedEntry("victor_chen",     "victor.chen@example.com",     "Victor",    "Chen",      Player.Sex.MALE,              LocalDate.of(1988, 11, 12), false, LocalDateTime.of(2026,  3, 30, 10, 30)),
            new SeedEntry("ruby_evans",      "ruby.evans@example.com",      "Ruby",      "Evans",     Player.Sex.FEMALE,            LocalDate.of(1996,  9, 25), false, LocalDateTime.of(2026,  3, 30, 21, 15)),
            new SeedEntry("finn_brady",      "finn.brady@example.com",      "Finn",      "Brady",     Player.Sex.MALE,              LocalDate.of(1991,  1, 14), false, LocalDateTime.of(2026,  4,  1, 12,  0)),
            new SeedEntry("lily_morgan",     "lily.morgan@example.com",     "Lily",      "Morgan",    Player.Sex.FEMALE,            LocalDate.of(2001,  6,  7), false, LocalDateTime.of(2026,  4,  1, 18, 45)),
            new SeedEntry("alex_grant",      "alex.grant@example.com",      "Alex",      "Grant",     Player.Sex.OTHER,             LocalDate.of(1993,  3, 22), false, LocalDateTime.of(2026,  4,  3,  9, 30)),
            new SeedEntry("jade_kim",        "jade.kim@example.com",        "Jade",      "Kim",       Player.Sex.FEMALE,            LocalDate.of(1987, 10,  9), false, LocalDateTime.of(2026,  4,  3, 15, 20)),
            new SeedEntry("ethan_murphy",    "ethan.murphy@example.com",    "Ethan",     "Murphy",    Player.Sex.MALE,              LocalDate.of(1995,  8, 31), false, LocalDateTime.of(2026,  4,  7, 11, 45)),
            new SeedEntry("isla_wright",     "isla.wright@example.com",     "Isla",      "Wright",    Player.Sex.FEMALE,            LocalDate.of(2000,  4, 18), false, LocalDateTime.of(2026,  4,  7, 17, 30)),
            new SeedEntry("oscar_green",     "oscar.green@example.com",     "Oscar",     "Green",     Player.Sex.MALE,              LocalDate.of(1986, 12,  5), false, LocalDateTime.of(2026,  4,  9,  8,  0)),
            new SeedEntry("maya_scott",      "maya.scott@example.com",      "Maya",      "Scott",     Player.Sex.FEMALE,            LocalDate.of(1998,  2, 27), false, LocalDateTime.of(2026,  4,  9, 14, 15)),
            new SeedEntry("felix_walker",    "felix.walker@example.com",    "Felix",     "Walker",    Player.Sex.MALE,              LocalDate.of(1992,  7,  3), false, LocalDateTime.of(2026,  4, 11, 10,  0)),
            new SeedEntry("zoe_king",        "zoe.king@example.com",        "Zoe",       "King",      Player.Sex.FEMALE,            LocalDate.of(1997,  5, 16), false, LocalDateTime.of(2026,  4, 11, 19, 50)),
            new SeedEntry("theo_hall",       "theo.hall@example.com",       "Theo",      "Hall",      Player.Sex.MALE,              LocalDate.of(1989,  9, 28), false, LocalDateTime.of(2026,  4, 14,  9, 15)),
            new SeedEntry("aria_james",      "aria.james@example.com",      "Aria",      "James",     Player.Sex.FEMALE,            LocalDate.of(2002,  3, 11), false, LocalDateTime.of(2026,  4, 14, 16, 30)),
            new SeedEntry("sam_baker",       "sam.baker@example.com",       "Sam",       "Baker",     Player.Sex.MALE,              LocalDate.of(1985, 11, 24), false, LocalDateTime.of(2026,  4, 16, 12, 45)),
            new SeedEntry("luna_cook",       "luna.cook@example.com",       "Luna",      "Cook",      Player.Sex.FEMALE,            LocalDate.of(1999,  7, 14), false, LocalDateTime.of(2026,  4, 16, 20,  0)),
            new SeedEntry("jake_young",      "jake.young@example.com",      "Jake",      "Young",     Player.Sex.MALE,              LocalDate.of(1993,  4,  6), false, LocalDateTime.of(2026,  4, 18, 11,  0)),
            new SeedEntry("nova_hill",       "nova.hill@example.com",       "Nova",      "Hill",      Player.Sex.FEMALE,            LocalDate.of(2003,  1, 19), false, LocalDateTime.of(2026,  4, 20,  8, 30)),
            new SeedEntry("eli_watson",      "eli.watson@example.com",      "Eli",       "Watson",    Player.Sex.MALE,              LocalDate.of(1990,  8, 22), false, LocalDateTime.of(2026,  4, 20, 15, 45)),
            new SeedEntry("piper_lee",       "piper.lee@example.com",       "Piper",     "Lee",       Player.Sex.FEMALE,            LocalDate.of(1996,  6,  3), false, LocalDateTime.of(2026,  4, 21, 13, 20)),
            new SeedEntry("max_butler",      "max.butler@example.com",      "Max",       "Butler",    Player.Sex.MALE,              LocalDate.of(1984,  2, 17), false, LocalDateTime.of(2026,  4, 22, 10, 10)),
            new SeedEntry("eva_turner",      "eva.turner@example.com",      "Eva",       "Turner",    Player.Sex.FEMALE,            LocalDate.of(1991, 10, 30), false, LocalDateTime.of(2026,  4, 23,  9,  0))
    );

    @Inject
    PlayerService playerService;

    void onStart(@Observes StartupEvent event) {
        if (Player.count() > 0) {
            LOG.info("DevDataSeeder: database already has players, skipping seed.");
            return;
        }

        LOG.info("DevDataSeeder: seeding " + SEED_PLAYERS.size() + " players...");

        int seeded = 0;
        for (SeedEntry entry : SEED_PLAYERS) {
            try {
                RegisterRequest request = new RegisterRequest();
                request.username = entry.username();
                request.email = entry.email();
                request.password = DEFAULT_PASSWORD;
                request.name = entry.name();
                request.surname = entry.surname();
                request.sex = entry.sex();
                request.birthday = entry.birthday();
                request.isAdmin = entry.isAdmin();
                AuthResponse response = playerService.register(request);
                playerService.backfillCreatedAt(response.player.id, entry.createdAt());
                seeded++;
            } catch (Exception e) {
                LOG.warnf("DevDataSeeder: skipped '%s' — %s", entry.username(), e.getMessage());
            }
        }

        LOG.infof("DevDataSeeder: done — %d/%d players inserted.", seeded, SEED_PLAYERS.size());
    }
}
